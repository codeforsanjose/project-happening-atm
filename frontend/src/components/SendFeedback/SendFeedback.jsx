import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NavBarHeader from "../NavBarHeader/NavBarHeader";

function SendFeedback() {
  const { i18n } = useTranslation();

  const [navToggled, setNavToggled] = useState(false);
  function handleToggle() {
    setNavToggled(!navToggled);
  }

  return (
    <div>
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      <h1>Send Feedback</h1>
      <p>
        We're eager to receive feedback from our community - feedback is a
        present which helps us improve. If you have any suggestions, send us an
        email at shareadmin@codeforsanjose.org.
      </p>
    </div>
  );
}

export default SendFeedback;
