import React from 'react';
import './NavLinks.scss';

import {
  ChevronRightIcon,
  CalendarTodayIcon,
  VoiceChatIcon,
  OnDemandVideoIcon,
  EmailIcon,
  NewReleasesIcon,
  FeedbackIcon,
} from '../../utils/_icons';

const LINKS = [
  {
    key: 'addToCalendar',
    icon: CalendarTodayIcon,
    text: 'Add Meeting to Calendar',
  },
  {
    key: 'joinMeeting',
    icon: VoiceChatIcon,
    text: 'Participate in the Virtual Meeting',
  },
  {
    key: 'watchBroadcast',
    icon: OnDemandVideoIcon,
    text: 'Watch Meeting Broadcast',
  },
  {
    key: 'submitComment',
    icon: EmailIcon,
    text: 'Submit Written Public Comment',
  },
  {
    key: 'requestConsideration',
    icon: NewReleasesIcon,
    text: 'Request Separate Consideration of a Consent Calendar Item',
  },
  {
    key: 'sendFeedback',
    icon: FeedbackIcon,
    text: 'Send Feedback',
  },
];

function NavLinks({ toggled }) {
  return (
    <div className={toggled ? 'nav-links nav-links-active' : 'nav-links'}>
      <div className="nav-links-title">Menu</div>
      <div className="nav-links-scroll">
        <ul className="nav-links-list">
          {LINKS.map(link => (
            <li key={link.key}>
              <a href="#" rel="noopener noreferrer">
                <link.icon className="nav-link-icon" />
                <span className="nav-link-text">{link.text}</span>
                <ChevronRightIcon className="nav-link-chevron" />
              </a>
              <div className="nav-link-separator" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NavLinks;
