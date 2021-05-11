import React from 'react';
import { useTranslation } from 'react-i18next';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';

function Header({ toggled, handleToggle }) {
  const { t } = useTranslation();

  return (
    <header>
      <nav className="no-select">
        <div className="nav-bar">
          <a href="/" rel="noopener noreferrer">
            {t('header.my-city-agenda')}
          </a>
          <input className="sign-in" type="button" value="Sign Out" />
          <HamburgerIcon onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} className="nav-links" />
      </nav>
    </header>
  );
}

export default Header;
