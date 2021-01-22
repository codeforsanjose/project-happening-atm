import React from 'react';
import { Link } from 'react-router-dom';
import './AgendaItem.scss';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

const itemLinks = [
  {
    getPath: (item) => `/subscribe/${item.meetingId}/${item.id}`,
    Icon: NotificationsIcon,
    text: 'Subscribe',
  },
  {
    getPath: (item) => '/',
    Icon: ShareIcon,
    text: 'Share',
  },
  {
    getPath: (item) => '/',
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
 */

function AgendaItem({ item }) {
  return (
    <div className="AgendaItem">
      {item.status !== 'Pending' && <div className="item-status">{item.status}</div>}

      <input type="checkbox" />
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
