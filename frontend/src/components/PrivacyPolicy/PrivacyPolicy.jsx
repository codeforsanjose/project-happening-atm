import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NavBarHeader from "../NavBarHeader/NavBarHeader";
import "./PrivacyPolicy.scss";

function TermsOfUse() {
  const { i18n } = useTranslation();

  const [navToggled, setNavToggled] = useState(false);
  function handleToggle() {
    setNavToggled(!navToggled);
  }

  return (
    <div>
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />
      <h1 className="header">Privacy Policy</h1>
      <p>
        We want you to know how City of San Jose uses and protects any
        information that you give when you use our website.
      </p>
      <h2>What information do we collect?</h2>
      <p>Information you provide</p>
      <ul>
        <li>
          Information volunteered by you, First and last name, Email address,
          and/or Phone number (optional), through signing up for an account with
          City of San Jose to receive notifications on meeting updates.
        </li>
        <li>
          We do not give, share, sell, rent or transfer any personal information
          to a third party.
        </li>
      </ul>
      <h2>Security</h2>
      <p>
        We are committed to ensuring that your information is secure. In order
        to prevent unauthorized access or disclosure we have put in place
        suitable electronic and managerial procedures to safeguard and secure
        the information we collect online.
      </p>
      <h2>Links to other websites</h2>
      <p>
        Our website may contain links to meetings. However, once you have used
        these links to leave our site, you should note that we do not have any
        control over that other website. Therefore, we cannot be responsible for
        the protection and privacy of any information which you provide whilst
        visiting such sites and such sites are not governed by this privacy
        statement. You should exercise caution and look at the privacy statement
        applicable to the website in question.
      </p>
      <h2>Disclose your personal information</h2>
      <p>We may disclose your personal information:</p>
      <ul>
        <li>
          To comply with any court order, law or legal process, including to
          respond to any government or regulatory request
        </li>
      </ul>
      <h2>Your consent</h2>
      <p>By using our site, you consent to our privacy policy.</p>
      <h2>Children under the age of 13</h2>
      <p>
        Our Website is not intended for children under 13 years of age. No one
        under the age of 13 may provide any personal information to, or on, the
        Website. We do not knowingly collect personal information from children
        under 13. If you are under 13, do not use or provide any information on
        this Website, or on or through any of its features/functionality, use
        any of the interactive or public comment features that may be available
        on this Website, or provide any information about yourself to us,
        including your name, telephone number, or e-mail address you may use.
      </p>
      <p>
        If we learn that we have collected or received personal information from
        a child under 13 without verification of parental consent, we will
        delete that information.
      </p>
      <h2>Accessing and correcting your information</h2>
      <p>
        You can review and change your personal information by logging into your
        profile through the website and visiting your account profile page or
        settings page.
      </p>
      <h2>Changes to our privacy policy</h2>
      <p>
        If we decide to change our privacy policy, we will post those changes on
        this page. Questions? Email us at sharedadmin@codeforsanjose.org
      </p>
    </div>
  );
}

export default TermsOfUse;
