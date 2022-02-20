import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import HamburgerIcon from "./HamburgerIcon";
import NavLinks from "./NavLinks";
import "./NavBarHeader.scss";
import NavigationLink from "./NavigationLink";
import {
  ATMLogoPinRainbowIcon,
  ATMLogoRainbowIcon,
  CaratDownIcon,
  FaqIcon,
  GlobeIcon,
  HomeIcon,
  ProfileIcon,
} from "../../utils/_icons";
import LoginContext from "../LoginContext/LoginContext";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import Signout from "./Signout";
import { Desktop, TabletOrMobile } from "../../utils/mediaquery";

function Header({ toggled, handleToggle }) {
  const { t } = useTranslation();

  const loginContext = React.useContext(LoginContext);

  return (
    <header>
      <nav className="no-select">
        {loginContext.signedIn ? "" : <Redirect to="/login" />}
        <div className="nav-bar">
          <Desktop>
            <ATMLogoRainbowIcon className="button-icon home-button-icon" />
          </Desktop>
          <TabletOrMobile>
            <div className="home-button-group">
              <ATMLogoPinRainbowIcon className="button-icon home-button-icon" />
              <span className="home-button-text">City of San Jose</span>
            </div>
          </TabletOrMobile>
          <Desktop>
            <div className="nav-link-group">
              <NavigationLink
                Icon={<HomeIcon className="button-icon" />}
                linkText={t("header.my-city-agenda")}
                path="/"
              />
              <NavigationLink
                Icon={<FaqIcon className="button-icon" />}
                linkText={t("navbar.faq")}
                path="/"
              />
              <NavigationLink
                Icon={<ATMLogoPinRainbowIcon className="button-icon" />}
                linkText={t("navbar.about")}
                path="/"
              />
              <LanguageDropdown />
              <NavigationLink
                Icon={<ProfileIcon className="button-icon" />}
                linkText={t("navbar.profile")}
                path="/"
              />
            </div>
            <Signout t={t} />
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
