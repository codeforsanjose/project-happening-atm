import React from 'react';
import { Link } from 'react-router-dom';
import './AgendaItem.scss';
import { buildSubscriptionQueryString } from '../../Subscribe/subscribeQueryString';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

const itemLinks = [
  {
    getPath: (item) => `/subscribe?${buildSubscriptionQueryString({ [item.meetingId]: { [item.id]: true } })}`,
    Icon: NotificationsIcon,
    text: 'Subscribe',
  },
  {
    getPath: () => '/',
    Icon: ShareIcon,
    text: 'Share',
  },
  {
    getPath: () => '/',
    Icon: AddIcon,
    text: 'More Info',
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
  const handleCheck = (evt) => {
    if (evt.target) {
      handleSelection(item.meetingId, item.id, evt.target.checked);
    }
  };

  return (
    <div className="AgendaItem">
      {item.status !== 'Pending' && <div className="item-status">{item.status}</div>}

      <input type="checkbox" checked={isSelected} onChange={handleCheck} />
      <h4>{item.title}</h4>
      <p>{item.description}</p>

      <div className="item-links">
        {
          itemLinks.map((link) => (
            <Link to={link.getPath(item)} key={link.text}>
              <div className="link">
                <link.Icon />
                <p>{link.text}</p>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export default AgendaItem;
