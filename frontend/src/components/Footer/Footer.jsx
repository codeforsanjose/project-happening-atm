import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.scss";

import CFSJ_Logo from "../../assets/CFSJ_Logo.svg";
import OSJ_Logo from "../../assets/OSJ_LogoWhite.png";

function Footer() {
  const { i18n } = useTranslation();

  return (
    <footer>
      <nav className="no-select">
        <div className="languages">
          <button
            type="button"
            onClick={() => i18n.changeLanguage("en")}
            className={i18n.language === "en" ? "current-language" : ""}
          >
            ENGLISH
          </button>
          <button
            type="button"
            onClick={() => i18n.changeLanguage("es")}
            className={i18n.language === "es" ? "current-language" : ""}
          >
            SPANISH
          </button>
          <button
            type="button"
            onClick={() => i18n.changeLanguage("vi")}
            className={i18n.language === "vi" ? "current-language" : ""}
          >
            VIETNAMESE
          </button>
        </div>
        <div className="logos">
          <a href="https://www.onlyinsj.org/" target="_blank" rel="noreferrer">
            <img className="OSJ" src={OSJ_Logo} alt="Only in San Jose" />
          </a>
          <a
            href="www.opensourcesanjose.org"
            target="_blank"
            rel="noreferrer"
          >
            <img className="CFSJ" src={CFSJ_Logo} alt="Code for San Jose" />
          </a>
        </div>
        <div className="legal">
          <NavLink to="/terms-of-use">Terms of Use</NavLink>
          <NavLink to="/privacy-policy">Privacy Policy</NavLink>
          <NavLink to="/send-feedback">Send Feedback</NavLink>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
