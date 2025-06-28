import './AdminNavigation/AdminNavigation.scss';

import AdminNavigationLink from './AdminNavigation/AdminNavigationLink';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';
import { EditIcon, InfoIcon, PublishIcon } from '../../utils/_icons';

const LINKS = [
  {
    key: 'editDetails',
    icon: InfoIcon,
    linkText: 'Edit Meeting Details',
  },
  {
    key: 'editAgenda',
    icon: EditIcon,
    linkText: 'Edit Agenda Items',
  },
  {
    key: 'uploadAgenda',
    icon: PublishIcon,
    linkText: 'Upload Agenda',
  },
];

/**
 * Admin side navigation component
 */

function AdminNavigation() {
  return (
    <div className='admin-navigation'>
      <img className='logo' src={cityLogo} />

      <div className='links'>
        <ul>
          {LINKS.map(link => (
            <AdminNavigationLink
              key={link.key}
              Icon={link.icon}
              linkText={link.linkText}
              // eslint-disable-next-line no-console
              handleClick={() => console.log(link.key)} // DEBUG: replace with click function
              active={link.key === 'editDetails'} // DEBUG: replace with conditional for current view
            />
          ))}
        </ul>
      </div>

      <button
        className='admin-publish-button'
        // eslint-disable-next-line no-console
        onClick={() => console.log('publish clicked')} // DEBUG: replace with publish action
        type='button'
      >
        Publish Changes
      </button>
    </div>
  );
}

export default AdminNavigation;
