import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Redirect,
} from 'react-router-dom';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';
import AdminNavigationLink from '../AdminView/AdminNavigation/AdminNavigationLink';
import { CaratDownIcon, FaqIcon, GlobeIcon, HappeningATMIcon, HomeIcon, ProfileIcon } from  '../../utils/_icons';
import LoginContext from '../LoginContext/LoginContext';
import LocalStorageTerms from '../../constants/LocalStorageTerms';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import { Desktop, TabletOrMobile } from "../../utils/mediaquery";

function Header({ toggled, handleToggle }) {
  const { t } = useTranslation();
  const loginContext = React.useContext(LoginContext);

  const signOut = () => {
    window.localStorage.setItem(LocalStorageTerms.TOKEN, '');
    window.localStorage.setItem(LocalStorageTerms.SIGNED_IN, false);
    loginContext.setSignedIn(false);
  };

  return (
    <header>
      <nav className="no-select">
        {loginContext.signedIn ? '' : <Redirect to="/login" /> }
        <div className="nav-bar">
          <HappeningATMIcon className="button-icon home-button-icon"/>
          <Desktop>
            <div className="nav-link-group">
                <AdminNavigationLink Icon={<HomeIcon className="button-icon"/>} linkText={t('header.my-city-agenda')} path="/" />
                <AdminNavigationLink Icon={<ProfileIcon className="button-icon"/>} linkText="Profile" path="/" />
                <AdminNavigationLink Icon={<FaqIcon className="button-icon" />} linkText="FAQ" path="/" />
                <LanguageDropdown/>
            </div>
          </Desktop>
          <Desktop>
            <button className="sign-out" type="button" onClick={signOut}>{t('navbar.sign-out')}</button>
          </Desktop>
          <TabletOrMobile>  
            <HamburgerIcon onClick={handleToggle} toggled={toggled} />
          </TabletOrMobile>
        </div>
        <TabletOrMobile>
          <NavLinks toggled={toggled} className="nav-links" />
         </TabletOrMobile>
      </nav>
    </header>
  );
}

export default Header;
