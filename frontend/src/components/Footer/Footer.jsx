import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.scss';

function Footer() {
  const { i18n } = useTranslation();
  return (
    <footer>
      <nav className="no-select">
        <div className="languages">
          <button type="button" onClick={() => i18n.changeLanguage('en')}>EN</button>
          <button type="button" onClick={() => i18n.changeLanguage('es')}>ES</button>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
