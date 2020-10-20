import React from 'react';
import './AdminNavigation.scss';

import AdminNavigationLink from './AdminNavigationLink';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';
import { ReactComponent as InfoIcon } from '../../assets/info-24px.svg';
import { ReactComponent as EditIcon } from '../../assets/edit-24px.svg';
import { ReactComponent as PublishIcon } from '../../assets/publish-24px.svg';

const LINKS = [
  {
    key: 'editDetails',
    icon: InfoIcon,
    linkText: 'Edit Meeting Details'
  },
  {
    key: 'editAgenda',
    icon: EditIcon,
    linkText: 'Edit Agenda Items'
  },
  {
    key: 'uploadAgenda',
    icon: PublishIcon,
    linkText: 'Upload New Agenda'
  }
]

/**
 * Admin side navigation component
 */

function AdminNavigation() {
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
                  handleClick={() => console.log(link.key)}    // DEBUG: replace with click function
                  active={link.key === 'editDetails'}   // DEBUG: replace with conditional for current view
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
