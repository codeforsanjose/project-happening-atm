import React from 'react';
import './NavLinks.scss';
import {
  CalendarTodayIcon,
  ATMLogoPinRainbowIcon,
  FaqIcon,
  HomeIcon,
  ProfileIcon,
} from '../../utils/_icons';
import NavigationLink from './NavigationLink';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import Signout from './Signout';

function NavLinks({ toggled, t }) {
  return (
    <div className={toggled ? 'nav-links nav-links-active' : 'nav-links'}>
      <div className="nav-links-scroll">
        <ul className="nav-links-list">
          <NavigationLink
            Icon={<CalendarTodayIcon />}
            linkText={t('navbar.calendar')}
            path="/"
          />
          <NavigationLink
            Icon={<ProfileIcon className="button-icon" />}
            linkText={t('navbar.profile')}
            path="/profile"
          />
          <NavigationLink
            Icon={<FaqIcon className="button-icon" />}
            linkText={t('navbar.faq')}
            path="/faq"
          />
          <NavigationLink
            Icon={<ATMLogoPinRainbowIcon className="button-icon" />}
            linkText={t('navbar.about')}
            path="/about"
          />
          <LanguageDropdown />
        </ul>
      </div>
      <Signout t={t} />
    </div>
  );
}

export default NavLinks;
