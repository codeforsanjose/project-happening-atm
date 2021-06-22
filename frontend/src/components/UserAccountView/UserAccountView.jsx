import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';

import './UserAccountView.scss';
import UserAccountUpdateForm from './UserAccountUpdateView';

// Component imports
import NavBarHeader from '../NavBarHeader/NavBarHeader';

function UserAccountView() {
  // const { t } = useTranslation();
  const title = 'Account Information';
  const [navToggled, setNavToggled] = useState(false);

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  return (
    <div className="user-account-info-view">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      <div className="user-account-header">
        <p className="title">
          This is the title:
          {` ${title}`}
        </p>
      </div>

      <div className="user-data">
        <label htmlFor="firstname">
          First Name
          <input type="text" id="firstname" name="firstname" className="user-data-form" value="Your First Name" />
        </label>
        <br />

        <label htmlFor="lastname">
          Last Name
          <input type="text" id="lastname" name="lastname" className="user-data-form" value="Your Last Name" />
        </label>
        <br />

        <label htmlFor="email">
          Email
          <input type="email" id="email" name="email" className="user-data-form" value="your_email@email.net" />
        </label>
        <br />

        <label htmlFor="phone">
          Phone Number
          <input type="tel" id="phone" name="phone" className="user-data-form" value="510-555-5555" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
        </label>
        <br />

        <button className="user-account-update-btn" type="submit">
          Update Account
        </button>
        <br />

        <span className="user-data-form">
          Reset Password? Click
          <a href="/">
            Here
          </a>
        </span>
      </div>

      {/* Need to show this only when the user clicks an edit button */}
      <br />
      <p>Update User Info Below</p>
      <UserAccountUpdateForm />
    </div>
  );
}

export default UserAccountView;
