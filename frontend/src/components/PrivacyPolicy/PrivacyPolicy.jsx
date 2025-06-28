import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../Footer/Footer.scss";
import NavBarHeader from "../NavBarHeader/NavBarHeader";
import privacyPolicyLanguages from "./PrivacyPolicyLanguageHTMLBlocks";

function TermsOfUse() {
  const { i18n } = useTranslation();
  const { language } = i18n;
  const [navToggled, setNavToggled] = useState(false);
  function handleToggle() {
    setNavToggled(!navToggled);
  }

  return (
    <div>
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />
      <div className="footer-pages-container">
        {privacyPolicyLanguages(language)}
      </div>
    </div>
  );
}

export default TermsOfUse;
