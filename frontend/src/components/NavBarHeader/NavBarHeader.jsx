import React from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useLocation } from 'react-router-dom';

import { ATMLogoPinRainbowIcon } from '../../utils/_icons';
import BackNavigation from '../BackNavigation/BackNavigation';
import LoginContext from '../LoginContext/LoginContext';
import HamburgerIcon from './HamburgerIcon';
import './NavBarHeader.scss';
import NavLinks from './NavLinks';

function Header({ toggled, handleToggle }) {
  const { pathname } = useLocation();
  const meetingCalendar = pathname === '/';

  const { t } = useTranslation();

  const loginContext = React.useContext(LoginContext);

  return (
    <header>
      <nav className='no-select'>
        {loginContext.signedIn ? '' : <Redirect to='/login' />}
        <div className='nav-bar'>
          <div className='home-button-group'>
            {meetingCalendar ? (
              <>
                <ATMLogoPinRainbowIcon className='home-button-icon' />
                <span className='home-button-text'>{t('navbar.city')}</span>
              </>
            ) : (
              <BackNavigation />
            )}
          </div>
          {meetingCalendar ? '' : <ATMLogoPinRainbowIcon />}
          <HamburgerIcon className='button-icon' onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} t={t} />
      </nav>
    </header>
  );
}

export default Header;
