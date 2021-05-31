import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Redirect,
} from 'react-router-dom';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';
import LoginContext from '../LoginContext/LoginContext';

function Header({ toggled, handleToggle }) {
  const { t } = useTranslation();
  const loginContext = React.useContext(LoginContext);

  const signOut = () => {
    window.localStorage.setItem('token', '');
    window.localStorage.setItem('signedIn', false);
    loginContext.setSignedIn(false);
  };

  return (
    <header>
      <nav className="no-select">
        {loginContext.signedIn ? '' : <Redirect to="/login" /> }
        <div className="nav-bar">
          <a href="/" rel="noopener noreferrer">
            {t('header.my-city-agenda')}
          </a>
          <button className="sign-out" type="button" onClick={signOut}>Sign Out</button>
          <HamburgerIcon onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} className="nav-links" />
      </nav>
    </header>
  );
}

export default Header;
