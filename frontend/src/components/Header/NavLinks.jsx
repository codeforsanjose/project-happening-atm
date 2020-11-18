import React from 'react';
import {
  CalendarTodayIcon,
  VoiceChatIcon,
  OnDemandVideoIcon,
  EmailIcon,
  NewReleasesIcon
} from '../../utils/_icons';

const LINKS = [
  {
    key: 'addToCalendar',
    icon: CalendarTodayIcon,
    text: 'Add Meeting to Calendar'
  },
  {
    key: 'joinMeeting',
    icon: VoiceChatIcon,
    text: 'Participate in the Virtual Meeting'
  },
  {
    key: 'watchBroadcast',
    icon: OnDemandVideoIcon,
    text: 'Watch Meeting Broadcast'
  },
  {
    key: 'submitComment',
    icon: EmailIcon,
    text: 'Submit Written Public Comment'
  },
  {
    key: 'requestConsideration',
    icon: NewReleasesIcon,
    text: 'Request Separate Consideration of a Consent Calendar Item'
  }
];

function NavLinks({ toggled }) {
  return (
    <ul className={toggled ? 'nav-links nav-links-active' : 'nav-links'}>
      {LINKS.map(link => (
        <li key={link.key}>
          <a href='#' rel='noopener noreferrer'>
            <link.icon className='nav-link-icon' />
            <span className='nav-link-text'>{link.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default NavLinks;
