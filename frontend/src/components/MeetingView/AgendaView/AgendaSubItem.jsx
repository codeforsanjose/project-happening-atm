import React from 'react';
import { Link } from 'react-router-dom';
import './AgendaSubItem.scss';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

const agendaSubItemLinks = [
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

export default function AgendaSubItem({ renderedAgendaSubItem }) {
  return (
    <div className="AgendaItem">
      {renderedAgendaSubItem.status !== 'Pending' && <div className="item-status">{renderedAgendaSubItem.status}</div>}

      <input type="checkbox" />
      <h4>{renderedAgendaSubItem.title}</h4>
      <p>{renderedAgendaSubItem.description}</p>

      <div className="item-links">
        {
          agendaSubItemLinks.map((link) => (
            <Link to={link.getPath(renderedAgendaSubItem)} key={link.text}>
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
