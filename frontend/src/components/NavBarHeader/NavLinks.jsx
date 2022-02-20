import React from 'react';
import './NavLinks.scss';
import { ATMLogoPinRainbowIcon, FaqIcon, HomeIcon, ProfileIcon } from '../../utils/_icons';
import NavigationLink from './NavigationLink';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import Signout from './Signout';

function NavLinks({ toggled, t }) {
  return (
    <div className={toggled ? 'nav-links nav-links-active' : 'nav-links'}>
      <div className="nav-links-scroll">
        <ul className="nav-links-list">
          <NavigationLink Icon={<HomeIcon className="button-icon" />} linkText={t('header.my-city-agenda')} path="/" />
          <NavigationLink Icon={<ProfileIcon className="button-icon" />} linkText="Profile" path="/" />
          <NavigationLink Icon={<FaqIcon className="button-icon" />} linkText="FAQ" path="/" />
          <NavigationLink Icon={<ATMLogoPinRainbowIcon className="button-icon" />} linkText={t('navbar.about')} path="/" />                
          <LanguageDropdown />
        </ul>
      </div>
     <Signout t={t}/>
    </div>
  );
}

export default NavLinks;
