/* eslint-disable react/jsx-props-no-spreading */
// Necessary as dnd sort uses prop spreading for its listeners and props
import React, {
  forwardRef, useState, useRef, useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getUserEmail, getUserPhone } from '../../../utils/verifyToken';
import SubscribeConfirmation from '../../Subscribe/SubscribeConfirmation';
import './AgendaItem.scss';
import { CREATE_SUBSCRIPTIONS, UPDATE_MEETING_ITEM } from '../../../graphql/graphql';
import isAdmin from '../../../utils/isAdmin';
import buildButtonClasses from '../../../utils/buildButtonClasses';
import { toTimeString } from '../../../utils/timestampHelper';

import {
  buildSubscriptionQueryString,
  convertQueryStringToServerFormat,
} from '../../Subscribe/subscribeQueryString';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import {
  NotificationFilledIcon, StatusCompleted, StatusDeferred, StatusInProgress, KeyboardArrowDownIcon,
  CloseIcon, ScheduleBlueIcon,
} from '../../../utils/_icons';
import ChangeMeetingStatusModal from '../../ChangeMeetingStatusModal/ChangeMeetingStatusModal';
import UpdateItemStartTimeModal from '../../ChangeMeetingStatusModal/UpdateItemStartTime/UpdateItemStartTimeModal';

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
function AgendaItem({
  item, subStatus, args,
}) {
  const { refetchAllMeeting, refetchSubs, getSubError } = args;

  const [disableSort, setDisableSort] = useState(false);
  const {
    attributes, listeners, setNodeRef, transform, transition,
  } = useSortable({ id: item.id, disabled: disableSort });

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

function AgendaItemActionLink({
  t, loading, handleSubmit, subscribed,
}) {
  if (subscribed) {
    return (
      <div className="link">
        <p className="disabled">
          {t('meeting.tabs.agenda.list.subscribe.button.done')}
        </p>
      </div>
    );
  }
  return (
    <div className="link" onClick={handleSubmit}>
      <p className={loading ? 'notify-me subscribing' : 'notify-me'}>
        {loading
          ? t('meeting.tabs.agenda.list.subscribe.button.doing')
          : t('meeting.tabs.agenda.list.subscribe.button.do')}
      </p>
    </div>
  );
}

const RenderedAgendaItem = forwardRef(
  ({
    subStatus, args, ...props
  }, ref) => {
    const {
      setDisableSort, refetchSubs, item,
      refetchAllMeeting, dragOverlay = false, getSubError = false,
    } = args;

    const [subscriptions, setSubscriptions] = useState(null);
    const [subscribed, setSubscribed] = useState(subStatus);
    const [dispalySetStatusModal, setDisplaySetStatusModal] = useState(false);
    const [displaySetStartTimeModal, setDisplaySetStartTimeModal] = useState(false);
    const [admin] = useState(isAdmin());
    const [buttonClasses] = useState(buildButtonClasses());
    const itemRef = useRef(null);
    const modalRef = useRef(null);
    const dropDownRef = useRef(null);
    const { t } = useTranslation();
    // check if time for item is set, store if it is
    const isTimeSet = item.item_start_timestamp !== "0";
    const agendaItemTime = isTimeSet ? toTimeString(item.item_start_timestamp) : null;

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
      },
    );

    const handleSubmit = (e) => {
      const phone = getUserPhone();
      const email = getUserEmail();
      e.preventDefault();
      const subscriptionQueryString = convertQueryStringToServerFormat(
        buildSubscriptionQueryString({ [item.meetingId]: { [item.id]: true } }),
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

    // arguments
    const changeMeetingStatusArgs = {
      item,
      dropDownRef,
      itemRef,
      setDisableSort,
      setDisplaySetStatusModal,
      refetchAllMeeting,
    };
    // The input within className='relativeEmptyContainer' is overlay on top of the actual checkbox.
    // This allows the smooth pressing of the checkbox and the ability to drag
    // Without this the dragOverlay prevented the pressing of the checkbox
    return (
      <div ref={itemRef}>
        <div {...props} ref={ref} className="AgendaItem">

          <div className="row">
            {item.status === MeetingItemStates.PENDING}
            <h4>{item.title_loc_key}</h4>
            <div className="item-status">
              {item.status === MeetingItemStates.COMPLETED && (<StatusCompleted />)}
              {item.status === MeetingItemStates.IN_PROGRESS && (<StatusInProgress />)}
              {item.status === MeetingItemStates.DEFERRED && (<StatusDeferred />)}
              {subscribed && (<NotificationFilledIcon />)}
            </div>

          </div>
          <p>{item.description_loc_key}</p>
          {subscriptions && subscriptions.length > 0 && (
            <SubscribeConfirmation
              numberOfSubscriptions={subscriptions.length}
              onClose={closeConfirmation}
              ref={modalRef}
            />
          )}
          {error && <div className="form-error">{error.message}</div>}
          {getSubError && <div className="form-error">{getSubError.message}</div>}

          {dispalySetStatusModal
            && (
              <ChangeMeetingStatusModal
                args={changeMeetingStatusArgs}
              />
            )}

          {displaySetStartTimeModal
            && (
              <UpdateItemStartTimeModal args={changeItemStartTimeArgs} />
            )}

          <div className="item-links">
            <div className="link">
              <p>
                <span>+</span>
                {t('meeting.tabs.agenda.list.more-info.button')}
              </p>
            </div>
              {/* verify user is admin,
                  if agenda item has a time specified, show time and icon to reset time,
                  If no time is specified, show button to open set time modal */}
            {admin &&
              <div className="link">
                {isTimeSet ? (
                  <div className='time admin'>
                    <span>{agendaItemTime}</span>
                    <button type='button' onClick={handleItemTimeReset}>
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <button type='button' onClick={handleDisplaySetStartTimeModal}>
                    Set Time
                  </button>
                )}
              </div>
            }

            {/* if user is participant and time is set, show time */}
            {!admin
              && isTimeSet
              && <div className="link">
                <div className="time">
                  <ScheduleBlueIcon />
                  <span>{agendaItemTime}</span>
                </div>
              </div>
            }
            {/* if Item status is completed, it will show completed;
                if Item status is deferred, it will show deferred;
                if Item statu is not subscribed, it will show notify me;
                if Item status is subscribed/subscribing it will show that */}

            {!isAdmin && item.status === MeetingItemStates.COMPLETED && (
              <div className="link">
                <p className="disabled">
                  {t('meeting.tabs.agenda.status.options.completed')}
                </p>
              </div>
            )}

            {!isAdmin && item.status === MeetingItemStates.DEFERRED && (
              <div className="link">
                <p className="deferred">
                  {t('meeting.tabs.agenda.status.options.deferred')}
                </p>
              </div>
            )}

            {(item.status !== MeetingItemStates.COMPLETED)
              && (item.status !== MeetingItemStates.DEFERRED)
              && (item.status !== MeetingItemStates.IN_PROGRESS)
              && !admin
              && (
                <AgendaItemActionLink t={t} item={item} loading={loading} handleSubmit={handleSubmit} subscribed={subscribed} />
              )}

            {admin && (
              <ul className="statusButtons">
                <li>
                  <input
                    type="button"
                    ref={dropDownRef}
                    className={buttonClasses.filter((elem) => elem.status === item.status)[0].class}
                    onClick={!dragOverlay ? () => {
                      setDisableSort(true);
                      setDisplaySetStatusModal(true);
                    } : null}
                    value={buttonClasses.filter((elem) => elem.status === item.status)[0].value}
                  />

                  <span className="relativeWrapper">
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                    <span
                      className={`${buttonClasses.filter((elem) => elem.status === item.status)[0].class} buttonDownArrow`}
                      onClick={!dragOverlay ? () => {
                        setDisableSort(true);
                        setDisplaySetStatusModal(true);
                      } : null}
                    >
                      <KeyboardArrowDownIcon />
                    </span>
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  },
);

// must export RenderedAgendaItem so that the dragOverlay can use it
export default AgendaItem;
export { RenderedAgendaItem };
