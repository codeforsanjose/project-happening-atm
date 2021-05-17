import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useHistory,
} from 'react-router-dom';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';

const signOut = (setSignedIn) => {
  window.localStorage.setItem('token', '');
  window.localStorage.setItem('signedIn', false);
  setSignedIn(false);
};

function Header({ toggled, handleToggle }) {
  const { t } = useTranslation();
  const [signedIn, setSignedIn] = useState(true);
  const history = useHistory();

  if (!signedIn) {
    history.push('/login');
  }

  return (
    <header>
      <nav className="no-select">
        <div className="nav-bar">
          <a href="/" rel="noopener noreferrer">
            {t('header.my-city-agenda')}
          </a>
          <input className="sign-in" type="button" value="Sign Out" onClick={() => { signOut(setSignedIn); }} />
          <HamburgerIcon onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} className="nav-links" />
      </nav>
    </header>
  );
}

export default Header;
