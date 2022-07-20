import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.scss";

function Footer() {
  const { i18n } = useTranslation();

  return (
    <footer>
      <nav className="no-select">
        <div className="languages">
          <NavLink to="/terms-of-use">Terms of Use</NavLink>
          <NavLink to="/privacy-policy">Privacy Policy</NavLink>
          <NavLink to="/send-feedback">Send Feedback</NavLink>
        </div>
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
      </nav>
    </footer>
  );
}

export default Footer;
