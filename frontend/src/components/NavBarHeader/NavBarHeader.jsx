import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Redirect } from 'react-router-dom';

import HamburgerIcon from './HamburgerIcon';
import BackNavigation from '../BackNavigation/BackNavigation';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';
import NavigationLink from './NavigationLink';
import { ATMLogoPinRainbowIcon } from '../../utils/_icons';
import LoginContext from '../LoginContext/LoginContext';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import Signout from './Signout';
import { Desktop, TabletOrMobile } from '../../utils/mediaquery';

function Header({ toggled, handleToggle }) {
  const { pathname } = useLocation();
  const meetingCalendar = pathname === '/';

  const { t } = useTranslation();

  const loginContext = React.useContext(LoginContext);

  return (
    <header>
      <nav className="no-select">
        {loginContext.signedIn ? '' : <Redirect to="/login" />}
        <div className="nav-bar">
          <div className="home-button-group">
            {meetingCalendar ? (
              <>
                <ATMLogoPinRainbowIcon className="home-button-icon" />
                <span className="home-button-text">{t('navbar.city')}</span>
              </>
            ) : (
              <BackNavigation />
            )}
          </div>
          {meetingCalendar ? '' : <ATMLogoPinRainbowIcon />}
          <HamburgerIcon
            className="button-icon"
            onClick={handleToggle}
            toggled={toggled}
          />
        </div>
        <NavLinks toggled={toggled} t={t} />
      </nav>
    </header>
  );
}

export default Header;
