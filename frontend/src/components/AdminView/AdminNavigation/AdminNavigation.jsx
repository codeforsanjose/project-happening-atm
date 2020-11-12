import React from 'react';
import './AdminNavigation.scss';

import AdminNavigationLink from './AdminNavigationLink';
import AdminPaths from '../../../constants/AdminPaths';

// Asset imports
import cityLogo from '../../../assets/SanJoseCityLogo.png';
import { ReactComponent as InfoIcon } from '../../../assets/info-24px.svg';
import { ReactComponent as EditIcon } from '../../../assets/edit-24px.svg';
import { ReactComponent as PublishIcon } from '../../../assets/publish-24px.svg';

const LINKS = [
  {
    key: 'editDetails',
    icon: InfoIcon,
    linkText: 'Edit Meeting Details',
    path: AdminPaths.EDIT_MEETING
  },
  {
    key: 'editAgenda',
    icon: EditIcon,
    linkText: 'Edit Agenda Items',
    path: AdminPaths.EDIT_AGENDA
  },
  {
    key: 'uploadAgenda',
    icon: PublishIcon,
    linkText: 'Upload New Agenda',
    path: AdminPaths.UPLOAD_CSV
  }
]

/**
 * Admin side navigation component
 */

function AdminNavigation({ meetingId }) {
  return (
    <div className="admin-navigation">
      <img className="logo" src={cityLogo} />

      <div className="links">
        <ul>
          {
            LINKS.map(link => {
              return (
                <AdminNavigationLink
                  key={link.key}
                  Icon={link.icon}
                  linkText={link.linkText}
                  path={link.path + '/' + meetingId}
                />
              );
            })
          }
        </ul>
      </div>

      <button
        className="admin-publish-button"
        onClick={() => console.log('publish clicked')}    // DEBUG: replace with publish action
      >
        Publish Changes
      </button>
    </div>
  );
}

export default AdminNavigation;
