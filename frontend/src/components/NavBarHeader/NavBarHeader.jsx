import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Redirect,
} from 'react-router-dom';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';
import NavigationLink from './NavigationLink';
import { CaratDownIcon, FaqIcon, GlobeIcon, HappeningATMIcon, HomeIcon, ProfileIcon } from  '../../utils/_icons';
import LoginContext from '../LoginContext/LoginContext';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import Signout from "./Signout";
import { Desktop, TabletOrMobile } from "../../utils/mediaquery";

function Header({ toggled, handleToggle }) {
  const { t } = useTranslation();

  const loginContext = React.useContext(LoginContext);
  
  return (
    <header>
      <nav className="no-select">
        {loginContext.signedIn ? '' : <Redirect to="/login" /> }
        <div className="nav-bar">
          <HappeningATMIcon className="button-icon home-button-icon"/>
          <Desktop>
            <div className="nav-link-group">
                <NavigationLink Icon={<HomeIcon className="button-icon"/>} linkText={t('header.my-city-agenda')} path="/" />
                <NavigationLink Icon={<ProfileIcon className="button-icon"/>} linkText="Profile" path="/" />
                <NavigationLink Icon={<FaqIcon className="button-icon" />} linkText="FAQ" path="/" />
                <LanguageDropdown/>
            </div>
            <Signout t={t}/>
          </Desktop>
          <TabletOrMobile>  
            <HamburgerIcon onClick={handleToggle} toggled={toggled} />
          </TabletOrMobile>
        </div>
        <TabletOrMobile>
          <NavLinks toggled={toggled} t={t} />
         </TabletOrMobile>
      </nav>
    </header>
  );
}

export default Header;
