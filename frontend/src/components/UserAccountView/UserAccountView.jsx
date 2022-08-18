import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNT_BY_EMAIL } from '../../graphql/graphql';
// import { useTranslation } from 'react-i18next';

import './UserAccountView.scss';
import UserAccountUpdateForm from './UserAccountUpdateView';

// Component imports
import NavBarHeader from '../NavBarHeader/NavBarHeader';

function UserAccountView() {
  // const { t } = useTranslation();
  const title = 'Account Information';
  const [navToggled, setNavToggled] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  const userEmail = localStorage.getItem("email_address");

  const { data } = useQuery(GET_ACCOUNT_BY_EMAIL,
    {
      variables: {
        email_address: userEmail,
      },
    });

  useEffect(() => {
    if (data) {
      setEmailAddress(data.getAccountByEmail.email_address);
      setPhoneNumber(data.getAccountByEmail.phone_number)
    }
  }, [data])

  return (
    <div className="user-account-info-view">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      <div className="user-account-header">
        <p className="title">
          {` ${title}`}
        </p>
      </div>

      <div className="user-data">

        <label htmlFor="email">
          Email
          <input type="email" id="email" name="email" className="user-data-form" value={emailAddress} />
          <a href='/update-email'><button>Edit</button></a>
        </label>
        <br />

        <label htmlFor="phone">
          Phone Number
          <input type="tel" id="phone" name="phone" className="user-data-form" value={phoneNumber} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
          <a href='/update-number'><button>Edit</button></a>
        </label>
        <br />

        <button className="user-account-update-btn" type="submit">
          Update Account
        </button>
        <br />

        <span className="user-data-form">
          Reset Password? Click
          <a href="/reset-password">
            Here
          </a>
        </span>
      </div>

      {/* Need to show this only when the user clicks an edit button */}
      {/* <br />
      <p>Update User Info Below</p>
      <UserAccountUpdateForm /> */}
    </div>
  );
}

export default UserAccountView;
