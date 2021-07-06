// import React, { useState, useEffect } from 'react';
import React from 'react';

const UserAccountUpdateForm = () => {
  const handleResetPassword = () => {
    alert('Password Reset Link Sent to {your email}');
  };

  return (
    <div className="user-data">
      <div>
        <label htmlFor="firstName">
          First Name
          <input type="text" id="firstName" className="user-data-form" placeholder="First Name" />
        </label>
        <button type="submit">Edit</button>
      </div>
      <div>
        <label htmlFor="lastName">
          Last Name
          <input type="text" id="lastName" className="user-data-form" placeholder="Last Name" />
        </label>
        <button type="submit">Edit</button>
      </div>
      <div>
        <label htmlFor="email">
          Email
          <input type="email" id="email" className="user-data-form" placeholder="Email" value="Your Email (Cannot Edit)" />
        </label>
      </div>
      <div>
        <label htmlFor="email">
          Phone
          <input type="tel" id="phone" name="phone" className="user-data-form" placeholder="510-555-5555" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
        </label>
        <button type="submit">Edit</button>
      </div>
      <span className="user-data-form">
        <button type="submit" onClick={handleResetPassword}>
          Reset Password
        </button>
      </span>
    </div>
  );
};

export default UserAccountUpdateForm;
