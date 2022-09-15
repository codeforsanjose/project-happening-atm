import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { getUserId } from "../../utils/verifyToken";
import { UPDATE_EMAIL } from "../../graphql/userAccount";
import {
  isNullOrEmpty, validEmail
} from '../../utils/validations';

// Component imports
import NavBarHeader from "../NavBarHeader/NavBarHeader";
import { CancelIcon } from '../../utils/_icons';
import "../UserAccountView/UserAccountView.scss";

const UpdateUserEmail = () => {
  const [navToggled, setNavToggled] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);
  const [updateEmailSuccessful, setUpdateEmailSuccessful] = useState(false);

  const [updateEmail] = useMutation(UPDATE_EMAIL);

  function handleToggle() {
    setNavToggled(!navToggled);
  }
  // TODO: fix email updating. apollo throws error currently
  function handleSubmit() {
    verifyEmailAddressFormat();
    if (!fieldErrors) {
      updateEmail({
        variables: {
          id: getUserId(),
          email: newEmail,
        },
      });
  
      setUpdateEmailSuccessful(true);
    }
  }

  const checkingEmail = (value) => {
    setNewEmail(value)
    verifyEmailAddressFormat();
  }

  const verifyEmailAddressFormat = () => {
    if (isNullOrEmpty(newEmail) || !validEmail(newEmail)) {
      setFieldErrors('Please enter a valid email address');
    } else {
      setFieldErrors('');
    }
  };

  return (
    <div className="update-user-email-view">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      {updateEmailSuccessful ? (
        <div className="user-account-header">
          <p className="title">Phone number was successfully updated!</p>
        </div>
      ) : (
        <>
          <div className="user-account-header">
            <p className="title">Email</p>
          </div>

          <form>
            <div>
              <label htmlFor="email" className='sr-only'>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Email"
                onChange={(e) => checkingEmail(e.target.value)}
              />
              {newEmail &&
                <button type='button' className='clear-form-input'>
                  <span className='sr-only'>Clear email</span>
                  <CancelIcon/>
                </button>
              }
              {fieldErrors
              ? <p className="inline-error">{fieldErrors}</p> : ''}
            </div>
            <button 
              className={`user-account-update-btn ${
                fieldErrors || !newEmail ? 'disabled' : ''}`}
              type="button"
              onClick={handleSubmit}
            >
              Change Email
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UpdateUserEmail;
