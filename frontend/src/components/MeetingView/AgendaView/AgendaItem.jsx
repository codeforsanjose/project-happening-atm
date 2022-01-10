/* eslint-disable react/jsx-props-no-spreading */
// Necessary as dnd sort uses prop spreading for its listeners and props
import React, { forwardRef, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getUserEmail, getUserPhone } from '../../../utils/verifyToken';
import SubscribeConfirmation from '../../Subscribe/SubscribeConfirmation';
import './AgendaItem.scss';
import { CREATE_SUBSCRIPTIONS } from '../../../graphql/graphql';

import {
  buildSubscriptionQueryString,
  convertQueryStringToServerFormat,
} from '../../Subscribe/subscribeQueryString';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import {
  NotificationsIcon, StatusCompleted, StatusDeferred, StatusInProgress,
} from '../../../utils/_icons';

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
function AgendaItem({ item }) {
  const {
    attributes, listeners, setNodeRef, transform, transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <RenderedAgendaItem
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      id={item.id}
      item={item}
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
  ({ item, id, ...props }, ref) => {
    const [subscriptions, setSubscriptions] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const modalRef = useRef(null);
    const { t } = useTranslation();

    const [createSubscriptions, { loading, error }] = useMutation(
      CREATE_SUBSCRIPTIONS,
      {
        onCompleted: (data) => {
          setSubscribed(true);
          setSubscriptions(data?.createSubscriptions ?? null);
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

    const closeConfirmation = () => {
      modalRef.current && modalRef.current.portal.close();
    };

    // The input within className='relativeEmptyContainer' is overlay on top of the actual checkbox.
    // This allows the smooth pressing of the checkbox and the ability to drag
    // Without this the dragOverlay prevented the pressing of the checkbox
    return (
      <div {...props} ref={ref} className="AgendaItem">

        <div className="row">
          {item.status === MeetingItemStates.PENDING}
          <h4>{item.title_loc_key}</h4>
          <div className="item-status">
            {item.status === MeetingItemStates.COMPLETED && (<StatusCompleted />)}
            {item.status === MeetingItemStates.IN_PROGRESS && (<StatusInProgress />)}
            {item.status === MeetingItemStates.DEFERRED && (<StatusDeferred />)}
            {subscribed && (<NotificationsIcon />)}
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
        <div className="item-links">
          <div className="link">
            <p>
              <span>+</span>
              {t('meeting.tabs.agenda.list.more-info.button')}
            </p>
          </div>
          {/* if Item status is completed, it will show completed;
              if Item status is deferred, it will show deferred;
              if Item statu is not subscribed, it will show notify me;
              if Item status is subscribed/subscribing it will show that */}

          {item.status === MeetingItemStates.COMPLETED && (
            <div className="link">
              <p className="disabled">
                {t('meeting.tabs.agenda.status.options.completed')}
              </p>
            </div>
          )}

          {item.status === MeetingItemStates.DEFERRED && (
          <div className="link">
            <p className="deferred">
              {t('meeting.tabs.agenda.status.options.deferred')}
            </p>
          </div>
          )}

          {(item.status !== MeetingItemStates.COMPLETED)
          && (item.status !== MeetingItemStates.DEFERRED)
          && (item.status !== MeetingItemStates.IN_PROGRESS)
          && (
            <AgendaItemActionLink t={t} item={item} loading={loading} handleSubmit={handleSubmit} subscribed={subscribed} />
          )}
        </div>
      </div>
    );
  },
);

// must export RenderedAgendaItem so that the dragOverlay can use it
export default AgendaItem;
export { RenderedAgendaItem };
