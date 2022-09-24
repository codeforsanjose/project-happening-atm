import React from 'react';
import './AdminNavigation.scss';

import AdminNavigationLink from './AdminNavigationLink';
import AdminPaths from '../../../constants/AdminPaths';

// Asset imports
import cityLogo from '../../../assets/SanJoseCityLogo.png';
import { InfoIcon, EditIcon, PublishIcon } from '../../../utils/_icons';

const LINKS = [
  {
    key: 'editDetails',
    icon: InfoIcon,
    linkText: 'Edit Meeting Details',
    path: AdminPaths.EDIT_MEETING,
  },
  {
    key: 'editAgenda',
    icon: EditIcon,
    linkText: 'Edit Agenda Items',
    path: AdminPaths.EDIT_AGENDA,
  },
  {
    key: 'uploadAgenda',
    icon: PublishIcon,
    linkText: 'Upload Agenda',
    path: AdminPaths.UPLOAD_CSV,
  },
];

/**
 * Admin side navigation component
 */

function AdminNavigation({ meetingId }) {
  return (
    <div className="admin-navigation">
      <img className="logo" src={cityLogo} alt="logo" />

      <div className="links">
        <ul>
          {LINKS.map((link) => (
            <AdminNavigationLink
              key={link.key}
              Icon={link.icon}
              linkText={link.linkText}
              path={`${link.path}/${meetingId}`}
            />
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="admin-publish-button"
        // eslint-disable-next-line no-console
        onClick={() => console.log('publish clicked')} // DEBUG: replace with publish action
        // TODO: https://github.com/codeforsanjose/gov-agenda-notifier/issues/84
      >
        Publish Changes
      </button>
    </div>
  );
}

export default AdminNavigation;
