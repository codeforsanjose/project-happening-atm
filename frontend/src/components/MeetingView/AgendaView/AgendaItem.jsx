import React from 'react';
import { Link } from 'react-router-dom';
import './AgendaItem.scss';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

const itemLinks = [
  {
    path: '/',
    Icon: NotificationsIcon,
    text: 'Subscribe',
  },
  {
    path: '/',
    Icon: ShareIcon,
    text: 'Share',
  },
  {
    path: '/',
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
            <Link to={link.path} key={link.text}>
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
