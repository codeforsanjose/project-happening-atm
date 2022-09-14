import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNT_BY_EMAIL } from '../../graphql/query';
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
        <div className="user-data-group">
          <p className='label'>Email</p>
          <p className='info'>{emailAddress}</p> 
          <a className='edit' href='/update-email'>Edit</a>
        </div>
        <div className="user-data-group">
          <p className='label'>Phone</p>
          <p className='info'>{phoneNumber}</p>
          <a className='edit' href='/update-number'>Edit</a>
        </div>
        <div className="user-data-group">
          <p className='label'>Password</p>
          <p className='info'>********</p>
          <a className='edit' href='/update-number'>Edit</a>
        </div>
      </div>
    </div>
  );
}

export default UserAccountView;
