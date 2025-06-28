import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../Footer/Footer.scss';
import NavBarHeader from '../NavBarHeader/NavBarHeader';
import termsOfUseLanguages from './TermsOfUseLanguageHTMLBlocks';

const TermsOfUse = () => {
  const { i18n } = useTranslation();
  const { language } = i18n;
  const [navToggled, setNavToggled] = useState(false);
  function handleToggle() {
    setNavToggled(!navToggled);
  }

  return (
    <div>
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />
      <div className='footer-pages-container'>{termsOfUseLanguages(language)}</div>
    </div>
  );
};

export default TermsOfUse;
