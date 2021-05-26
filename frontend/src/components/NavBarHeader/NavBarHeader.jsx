import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Redirect,
} from 'react-router-dom';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';
import ThemeContext from '../ThemeContext/ThemeContext';

const signOut = (contextType) => {
  window.localStorage.setItem('token', '');
  window.localStorage.setItem('signedIn', false);
  contextType.setSignedIn(false);
};

function Header({ toggled, handleToggle }) {
  const { t } = useTranslation();
  const contextType = React.useContext(ThemeContext);

  return (
    <header>
      <nav className="no-select">
        {contextType.signedIn ? '' : <Redirect to="/login" /> }
        <div className="nav-bar">
          <a href="/" rel="noopener noreferrer">
            {t('header.my-city-agenda')}
          </a>
          <input className="sign-out" type="button" value="Sign Out" onClick={() => { signOut(contextType); }} />
          <HamburgerIcon onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} className="nav-links" />
      </nav>
    </header>
  );
}

export default Header;
