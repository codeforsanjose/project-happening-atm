import React from 'react';
import './AdminNavigation.scss';

import AdminNavigationLink from './AdminNavigationLink';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';
import infoIcon from '../../assets/info-24px.svg';
import editIcon from '../../assets/edit-24px.svg';
import publishIcon from '../../assets/publish-24px.svg';

const LINKS = [
  {
    key: 'editDetails',
    icon: infoIcon,
    linkText: 'Edit Meeting Details'
  },
  {
    key: 'editAgenda',
    icon: editIcon,
    linkText: 'Edit Agenda Items'
  },
  {
    key: 'uploadAgenda',
    icon: publishIcon,
    linkText: 'Upload New Agenda'
  }
]

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
                        icon={link.icon}
                        linkText={link.linkText}
                      />
                    );
                  })
                }
              </ul>
            </div>

            <button className="admin-publish-button">Publish Changes</button>
        </div>
    );
}

export default AdminNavigation;
