import React from 'react';
import { Link } from 'react-router-dom';
import './MeetingAgendaItem.scss';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../utils/_icons';

const itemLinks = [
  {
    path: '/',
    Icon: NotificationsIcon,
    text: 'Subscribe'
  },
  {
    path: '/',
    Icon: ShareIcon,
    text: 'Share'
  },
  {
    path: '/',
    Icon: AddIcon,
    text: 'More Info'
  }
]

function MeetingAgendaItem({ item }) {
  return (
    <div className="MeetingAgendaItem">
      <div className="item-status">{item.status}</div>
      <input type="checkbox"/>
      <h4>{item.title}</h4>
      <p>{item.description}</p>

      <div className="item-links">
        {itemLinks.map(link => {
          return (
            <Link to={link.path}>
              <div className="link">
                <link.Icon />
                <p>{link.text}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MeetingAgendaItem;