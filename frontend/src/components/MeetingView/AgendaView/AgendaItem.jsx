/* eslint-disable react/jsx-props-no-spreading */
// Necessary as dnd sort uses prop spreading for its listeners and props
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getUserEmail, getUserPhone } from '../../../utils/verifyToken';
import SubscribeConfirmation from '../../Subscribe/SubscribeConfirmation';
import './AgendaItem.scss';
import {
  CREATE_SUBSCRIPTIONS,
  UPDATE_MEETING_ITEM,
} from '../../../graphql/mutation';
import isAdmin from '../../../utils/isAdmin';
import { toTimeString } from '../../../utils/timestampHelper';

import {
  buildSubscriptionQueryString,
  convertQueryStringToServerFormat,
} from '../../Subscribe/subscribeQueryString';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import {
  NotificationFilledIcon,
  StatusInProgress,
  CloseIcon,
  ScheduleBlueIcon,
} from '../../../utils/_icons';
import UpdateItemStartTimeModal from "../../UpdateItemStartTimeModal/UpdateItemStartTimeModal";
import Dropdown from '../../Dropdown/Dropdown';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";

/**
 *
 * An agenda group and accordion sub item
 *
 * props:
 *    item
 *      Object that represents an agenda item.
 *      {
 *        id: Number id of item
 *        meetingId: Number id of the corresponding meeting
 *        title:  String title of item
 *        description:  String description of item
 *        status: String status of item
 *      }

 *    dragOverlayActive
 *      Indicates an item is being dragged
 *
 * 10.2021 Update: Per product team direction, this component has
 * been updated such that the subscribe button directly triggers
 * user subscriptions to be sent to the registered contact info
 * associated to the account.
 *
 * subscriptions details:
 *      Newly created subscriptions (response from the server)
 *    createSubscriptions
 *      The function that creates a subscription (or subscriptions) on the server
 *    loading
 *      A boolean values that indicates whether the communication with the server is in progress
 *    error
 *      An error object returned from the server if there is any error
 */

/**
 * Important
 *
 *  RenderedAgendaItem is creating a overlay checkbox that renders on top of the component.
 *  Any changes that change the height of the component will cause the overlay checkbox to align
 *  The overlay checkbox can be adjusted in AgendaItem.scss
 *
 */

// The AgendaItem has to contain RenderedAgendaItem to ensure the drag overlay works correctly
function AgendaItem({ item, subStatus, args }) {
  const { refetchAllMeeting, refetchSubs, getSubError } = args;

  const [disableSort, setDisableSort] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id, disabled: disableSort });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderedAgendaItemArgs = {
    item,
    refetchSubs,
    refetchAllMeeting,
    getSubError,
    setDisableSort,
  };

  return (
    <RenderedAgendaItem
      {...attributes}
      {...listeners}
      style={style}
      ref={setNodeRef}
      subStatus={subStatus}
      args={renderedAgendaItemArgs}
    />
  );
}

function AgendaItemActionLink({ loading, handleSubmit, subscribed }) {
  const { t } = useTranslation();
  if (subscribed) {
    return (
      <div className="link">
        <p className="subscribed">
          {t("meeting.tabs.agenda.list.subscribe.button.done")}
        </p>
        <NotificationFilledIcon />
      </div>
    );
  }
  return (
    <div className="link" onClick={handleSubmit}>
      <p className={loading ? "notify-me subscribing" : "notify-me"}>
        {loading
          ? t("meeting.tabs.agenda.list.subscribe.button.doing")
          : t("meeting.tabs.agenda.list.subscribe.button.do")}
      </p>
    </div>
  );
}

const RenderedAgendaItem = forwardRef(({ subStatus, args, ...props }, ref) => {
  const {
    setDisableSort,
    refetchSubs,
    item,
    refetchAllMeeting,
    dragOverlay = false,
    getSubError = false,
  } = args;

  const [subscriptions, setSubscriptions] = useState(null);
  const [subscribed, setSubscribed] = useState(subStatus);
  const [displaySetStartTimeModal, setDisplaySetStartTimeModal] =
    useState(false);
  const [admin] = useState(isAdmin());
  const { t } = useTranslation();

  // possible agenda item statuses to be passed into dropdown w/ internationalization of status labels
  const agendaItemStatuses = [
    {
      label: "meeting.tabs.agenda.status.options.upcoming",
      value: MeetingItemStates.UPCOMING,
      class: "upcoming",
    },
    {
      label: "meeting.tabs.agenda.status.options.in-progress",
      value: MeetingItemStates.IN_PROGRESS,
      class: "in-progress",
    },
    {
      label: "meeting.tabs.agenda.status.options.on-hold",
      value: MeetingItemStates.ON_HOLD,
      class: "on-hold",
    },
    {
      label: "meeting.tabs.agenda.status.options.completed",
      value: MeetingItemStates.COMPLETED,
      class: "completed",
    },
    {
      label: "meeting.tabs.agenda.status.options.deferred",
      value: MeetingItemStates.DEFERRED,
      class: "deferred",
    },
  ];

  // index map of different agenda item statuses
  const statusIndexMap = agendaItemStatuses.map((status) => status.value);

  // current agenda item state
  const [agendaItemStatus, setAgendaItemStatus] = useState(
    agendaItemStatuses[statusIndexMap.indexOf(item.status)]
  );
  // pending agenda item state
  const [pendingAgendaItemStatus, setPendingAgendaItemStatus] =
    useState(agendaItemStatus);

  // open/close states for agenda item status change confirmation modal:
  const [showConfirmationModal, setShowConfirmationModa] = useState(false);
  const closeConfirmationModal = () => {
    setShowConfirmationModa(false);
  };
  const openConfirmationModal = () => {
    setShowConfirmationModa(true);
  };

  const itemRef = useRef(null);
  const modalRef = useRef(null);
  // check if time for item is set, store if it is
  const isTimeSet = item.item_start_timestamp !== "0";
  const agendaItemTime = isTimeSet
    ? toTimeString(item.item_start_timestamp)
    : null;

  const [updateAgendaItemStatus, { loadingStatus, errorMsg }] = useMutation(
    UPDATE_MEETING_ITEM,
    {
      onCompleted: () => {
        try {
          refetchAllMeeting(); // need to refetch meeting in case status changes to "In Progress"
        } catch (error) {
          console.log(`Error updating agenda item status: ${error.message}`);
        }
      },
      onError: (error) => {
        console.log(`Error updating agenda item status: ${error.message}`);
      },
    }
  );
  // Define prop values for the confirmation modal for admins to change the agenda item status:
  // Note: different language support can be added later as this is for Admins anyhow (translation currently missing in .yaml files)
  const modalHeaderText = "Update item status";
  const modalBodyText = errorMsg ? (
    <>
      There was an error, please try again. This action will update the item
      status to{" "}
      <b>
        <em>{t(pendingAgendaItemStatus.label)}</em>
      </b>{" "}
      and notify all users.`
    </>
  ) : (
    <>
      This action will update the item status to{" "}
      <b>
        <em>{t(pendingAgendaItemStatus.label)}</em>
      </b>{" "}
      and notify all users.
    </>
  );
  // different language support can be added later as this is for Admins anyhow
  const modalActionButton = (
    <button
      onClick={() => setAgendaItemStatus(pendingAgendaItemStatus)}
      disabled={loadingStatus}
      className="action-button"
    >
      Update
    </button>
  );
  const modalCancelButton = (
    <button
      type="button"
      className="cancel-button"
      onClick={() => {
        setPendingAgendaItemStatus(agendaItemStatus);
        closeConfirmationModal();
      }}
    >
      {t("standard.buttons.cancel")}
    </button>
  );

  useEffect(() => {
    if (subStatus && !admin) {
      setSubscribed(subStatus);
    }
    if (dragOverlay && !admin) {
      setSubscribed(subStatus);
    }
  }, [subStatus, dragOverlay, admin]);

  const [createSubscriptions, { loading, error }] = useMutation(
    CREATE_SUBSCRIPTIONS,
    {
      onCompleted: (data) => {
        setSubscribed(true);
        setSubscriptions(data?.createSubscriptions ?? null);
        refetchSubs();
      },
    }
  );

  const [updateItem] = useMutation(UPDATE_MEETING_ITEM, {
    onCompleted: () => {
      refetchAllMeeting();
    },
    onError: (error) => {
      console.log(`Error resetting time: ${error.message}`);
    },
  });

  // re-render whenever agenda item status changes
  useEffect(() => {
    if (isAdmin() && item?.status && agendaItemStatus.value !== item.status) {
      updateAgendaItemStatus({
        variables: {
          ...item,
          status: agendaItemStatus.value,
        },
      });
      if (!error) closeConfirmationModal();
    }
  }, [agendaItemStatus, item.status]);

  // handle new user selection for meeting status
  const handleSelectStatus = (option) => {
    openConfirmationModal();
    setPendingAgendaItemStatus(option);
    // setAgendaItemStatus(option);
  };

  const handleItemTimeReset = () => {
    const defaultTime = new Date(0);
    updateItem({
      variables: {
        ...item,
        item_start_timestamp: `${defaultTime.getTime()}`,
      },
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const phone = getUserPhone();
    const email = getUserEmail();
    const subscriptionQueryString = convertQueryStringToServerFormat(
      buildSubscriptionQueryString({ [item.meetingId]: { [item.id]: true } })
    );
    createSubscriptions({
      variables: {
        phone_number: phone,
        email_address: email,
        meetings: subscriptionQueryString,
      },
    });
  };

  const handleDisplaySetStartTimeModal = () => {
    if (dragOverlay) return;
    setDisableSort(true);
    setDisplaySetStartTimeModal(true);
  };

  const closeConfirmation = () => {
    modalRef.current && modalRef.current.portal.close();
  };

  const changeItemStartTimeArgs = {
    item,
    setDisplaySetStartTimeModal,
    refetchAllMeeting,
  };

  // The input within className='relativeEmptyContainer' is overlay on top of the actual checkbox.
  // This allows the smooth pressing of the checkbox and the ability to drag
  // Without this the dragOverlay prevented the pressing of the checkbox
  return (
    <div ref={itemRef}>
      <div
        {...props}
        ref={ref}
        className={`AgendaItem ${agendaItemStatus.class}`}
      >
        <div className="row">
          {item.status === MeetingItemStates.UPCOMING}
          <h4>{item.title_loc_key}</h4>
        </div>
        {subscriptions && subscriptions.length > 0 && (
          <SubscribeConfirmation
            numberOfSubscriptions={subscriptions.length}
            onClose={closeConfirmation}
            ref={modalRef}
          />
        )}
        {error && <div className="form-error">{error.message}</div>}
        {getSubError && <div className="form-error">{getSubError.message}</div>}
        {displaySetStartTimeModal && (
          <UpdateItemStartTimeModal args={changeItemStartTimeArgs} />
        )}

        <div className="item-links">
          {/* verify user is admin,
                  if agenda item has a time specified, show time and icon to reset time,
                  If no time is specified, show button to open set time modal */}
          {admin && (
            <div className="link status">
              {isTimeSet ? (
                <div className="time admin">
                  <span>{agendaItemTime}</span>
                  <button type="button" onClick={handleItemTimeReset}>
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={handleDisplaySetStartTimeModal}>
                  {t("meeting.tabs.agenda.status.modal.set-time.title")}
                </button>
              )}
            </div>
          )}
          {/* if user is community user and time is set, show time
            otherwise we show the item status (completed, on hold, in progress, deferred) */}
          {!admin &&
            (isTimeSet ? (
              <div className="link status">
                <p className="time">
                  <ScheduleBlueIcon />
                  {agendaItemTime}
                </p>
              </div>
            ) : (
              <div className="link status">
                <p className={agendaItemStatus.class}>
                  {item.status === MeetingItemStates.IN_PROGRESS && (
                    <span>
                      <StatusInProgress />
                    </span>
                  )}
                  {agendaItemStatus.value !== MeetingItemStates.UPCOMING &&
                    t(agendaItemStatus.label)}
                </p>
              </div>
            ))}
          {/* show user subscription status or a notify me button */}
          {agendaItemStatus.value !== MeetingItemStates.COMPLETED &&
            agendaItemStatus.value !== MeetingItemStates.DEFERRED &&
            agendaItemStatus.value !== MeetingItemStates.IN_PROGRESS &&
            !admin && (
              <AgendaItemActionLink
                item={item}
                loading={loading}
                handleSubmit={handleSubscribe}
                subscribed={subscribed}
              />
            )}

          {admin && (
            <>
              <div className="dropdown-container">
                <Dropdown
                  options={agendaItemStatuses}
                  value={agendaItemStatus}
                  onChange={handleSelectStatus}
                  className="agenda-item-status"
                />
              </div>
              {showConfirmationModal && (
                <ConfirmationModal
                  isOpen={showConfirmationModal}
                  closeModal={closeConfirmationModal}
                  headerText={modalHeaderText}
                  bodyText={modalBodyText}
                  actionButton={modalActionButton}
                  cancelButton={modalCancelButton}
                  contentLabel="Update Agenda Item Status"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

// must export RenderedAgendaItem so that the dragOverlay can use it
export default AgendaItem;
export { RenderedAgendaItem };
