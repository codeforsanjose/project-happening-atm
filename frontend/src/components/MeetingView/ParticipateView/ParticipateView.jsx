import React from 'react';
import './ParticipateView.scss';

import ParticipateLink from './ParticipateLink';
import {
  VoiceChatIcon, OnDemandVideoIcon, EmailIcon, NewReleasesIcon,
} from '../../../utils/_icons';

const LINKS = [
  {
    key: 'join',
    icon: VoiceChatIcon,
    linkText: 'Join the Virtual Meeting',
    path: '/participate/join',
  },
  {
    key: 'watch',
    icon: OnDemandVideoIcon,
    linkText: 'Watch Meeting Broadcast',
    path: '/participate/watch',
  },
  {
    key: 'comment',
    icon: EmailIcon,
    linkText: 'Submit Written Public Comment',
    path: '/participate/comment',
  },
  {
    key: 'request',
    icon: NewReleasesIcon,
    linkText: 'Request Separate Consideration of a Consent Calendar Item',
    path: '/participate/request',
  },
];

function ParticipateView() {
  return (
    <div className="ParticipateView">
      <ul>
        {LINKS.map((link) => (
          <ParticipateLink
            key={link.key}
            Icon={link.icon}
            linkText={link.linkText}
            path={link.path}
          />
        ))}
      </ul>
    </div>
  );
}

export default ParticipateView;
