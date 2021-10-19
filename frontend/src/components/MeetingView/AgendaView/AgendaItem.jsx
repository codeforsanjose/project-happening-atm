/* eslint-disable react/jsx-props-no-spreading */
// Necessary as dnd sort uses prop spreading for its listeners and props
import React, { forwardRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { getUserEmail, getUserPhone } from '../../../utils/verifyToken';
import SubscribeConfirmation from '../../Subscribe/SubscribeConfirmation';

import './AgendaItem.scss';
import { CREATE_SUBSCRIPTIONS } from '../../../graphql/graphql';
import Spinner from '../../Spinner/Spinner';

import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { buildSubscriptionQueryString, convertQueryStringToServerFormat } from '../../Subscribe/subscribeQueryString';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

const itemLinks = [
  // {
  //   getPath: (item) => `/subscribe?${buildSubscriptionQueryString({ [item.meetingId]: { [item.id]: true } })}`,
  //   Icon: NotificationsIcon,
  //   text: 'meeting.tabs.agenda.list.subscribe.button.do',
  //   isDisabled: (item) => item.status === MeetingItemStates.IN_PROGRESS
  //     || item.status === MeetingItemStates.COMPLETED,
  // },
  {
    getPath: () => '/',
    Icon: ShareIcon,
    text: 'meeting.tabs.agenda.list.share.button',
    isDisabled: () => false,
  },
  {
    getPath: () => '/',
    Icon: AddIcon,
    text: 'meeting.tabs.agenda.list.more-info.button',
    isDisabled: () => false,
  },
];

/**
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
 *    isSelected
 *      A boolean value representing if this agenda item is selected (checked) by user
 *    handleSelection
 *      A handler for agenda item selection
 *    dragOverlayActive
 *      Indicates an item is being dragged
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
function AgendaItem({ item, isSelected, handleSelection }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
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
      isSelected={isSelected}
      handleSelection={handleSelection}
    />
  );
}

function AgendaItemActionLink({ link }) {
  const { t } = useTranslation();
  return (
    <div className="link">
      <link.Icon />
      <p>{t(link.text)}</p>
    </div>
  );
}

const RenderedAgendaItem = forwardRef(({
  handleSelection, isSelected, item, id, ...props
}, ref) => {
  const [email, setEmail] = useState(getUserEmail());
  // const [phone, setPhone] = useState(getUserPhone(null));
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  // const [phoneError, setPhoneError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const { t } = useTranslation();

  const [createSubscriptions, { loading, error }] = useMutation(
    CREATE_SUBSCRIPTIONS,
    {
      onCompleted: (data) => setSubscriptions(data?.createSubscriptions ?? null),
    },
  );
  const history = useHistory();

  const handleCheck = (evt) => {
    if (evt.target) {
      handleSelection(item.parent_meeting_item_id, item.id, evt.target.checked);
    }
  };
  
  const closeConfirmation = () => {
    history.goBack();
  };

  const subscriptionQueryString = convertQueryStringToServerFormat(buildSubscriptionQueryString({ [item.meetingId]: { [item.id]: true } }));
  //console.log("subscriptionQueryString:", subscriptionQueryString);

  const handleSubmit = (e) => {
    setFormSubmitted(true);
    // setPhoneError(null);
    setEmailError(null);

    e.preventDefault();

    createSubscriptions({
      variables: {
         phone_number: '15106487794',
        email_address: email,
        meetings: subscriptionQueryString,
      },
    });
  };

  // The input within className='relativeEmptyContainer' is overlay on top of the actual checkbox.
  // This allows the smooth pressing of the checkbox and the ability to drag
  // Without this the dragOverlay prevented the pressing of the checkbox
  return (
    <div {...props} ref={ref} className="AgendaItem">
      {item.status !== MeetingItemStates.PENDING
          && <div className="item-status">{item.status}</div>}

      <div className="row">
        {item.status === MeetingItemStates.PENDING && <input type="checkbox" checked={isSelected} onChange={handleCheck} />}
        <h4>{item.title_loc_key}</h4>
      </div>
      <p>{item.description_loc_key}</p>
      { subscriptions && subscriptions.length > 0
              && (
                <SubscribeConfirmation
                  numberOfSubscriptions={subscriptions.length}
                  onClose={closeConfirmation}
                />
              )}
            { error
              && (
                <div className="form-error">{ error.message }</div>
              )}              
      {/* <div className="item-links">

            </div> */}
      <div className="item-links">
      <a href="/"
                // disabled={!phone && !email}
                onClick={handleSubmit}
              >
                <div class="link">
                  <NotificationsIcon/>
                  <p>
                {loading && <Spinner />}
                
                {t('meeting.tabs.agenda.list.subscribe.button.do')}
                {/* {`Subscrib${loading ? 'ing...' : 'e'}`} */}
                </p>
                </div>
              </a>
        {
            itemLinks.map((link) => {
              if (link.isDisabled(item)) {
                return (
                  <div className="disabled" key={`${item.id}link`}>
                    <AgendaItemActionLink link={link} />
                  </div>
                );
              }
              return (
                <Link to={link.getPath(item)} key={link.text}>
                  <AgendaItemActionLink link={link} />
                </Link>
              );
            })
          }
      </div>
    </div>
  );
});

// must export RenderedAgendaItem so that the dragOverlay can use it
export default AgendaItem;
export { RenderedAgendaItem };
