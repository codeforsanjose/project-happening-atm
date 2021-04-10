import React from 'react';
import { Link } from 'react-router-dom';
import './AgendaItem.scss';
import { buildSubscriptionQueryString } from '../../Subscribe/subscribeQueryString';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

import {
  useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
const itemLinks = [
  {
    getPath: (item) => `/subscribe?${buildSubscriptionQueryString({ [item.meetingId]: { [item.id]: true } })}`,
    Icon: NotificationsIcon,
    text: 'Subscribe',
    isDisabled: (item) => item.status === MeetingItemStates.IN_PROGRESS
      || item.status === MeetingItemStates.COMPLETED,
  },
  {
    getPath: () => '/',
    Icon: ShareIcon,
    text: 'Share',
    isDisabled: () => false,
  },
  {
    getPath: () => '/',
    Icon: AddIcon,
    text: 'More Info',
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
 */

function AgendaItem({ item, isSelected, handleSelection }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: item.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCheck = (evt) => {
    if (evt.target) {
      handleSelection(item.parent_meeting_item_id, item.id, evt.target.checked);
    }
  };

  return (
    <div className="AgendaItem" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {item.status !== MeetingItemStates.PENDING
        && <div className="item-status">{item.status}</div>}

      <div className="row">
        <input type="checkbox" checked={isSelected} onChange={handleCheck} />
        <h4>{item.title_loc_key}</h4>
      </div>
      <p>{item.description_loc_key}</p>

      <div className="item-links">
        {
          itemLinks.map((link) => {
            if (link.isDisabled(item)) {
              return (
                <div className="disabled">
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
}

function AgendaItemActionLink({ link }) {
  return (
    <div className="link">
      <link.Icon />
      <p>{link.text}</p>
    </div>
  );
}

export default AgendaItem;
