import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { getUserId } from "../../utils/verifyToken";
import { UPDATE_PHONE_NUMBER } from "../../graphql/graphql";
import {
  isNullOrEmpty, isNumericString
} from '../../utils/validations';

// Component imports
import NavBarHeader from "../NavBarHeader/NavBarHeader";

import "../UserAccountView/UserAccountView.scss";
import icon from '../../assets/info-24px.svg';

const UpdateUserNumber = () => {
  const [navToggled, setNavToggled] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [fieldErrors, setFieldErrors] = useState(null);
  const [updateNumberSuccessful, setUpdateNumberSuccessful] = useState(false);

  const [updatePhoneNumber] = useMutation(UPDATE_PHONE_NUMBER);

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  function handleSubmit(e) {
    e.preventDefault();
    verifyPhoneNumberFormat();
    if (!fieldErrors) {
      updatePhoneNumber({
        variables: {
          id: getUserId(),
          phone_number: newNumber,
        },
      });

      setUpdateNumberSuccessful(true);
    }
  }

  const checkingPhoneNumber = (value) => {
    setNewNumber(value)
    verifyPhoneNumberFormat();
  }

  const verifyPhoneNumberFormat = () => {
    if (!isNullOrEmpty(newNumber)) {
      if (!isNumericString(newNumber)) {
        setFieldErrors('Phone number not numeric');
      } else if (newNumber.charAt(0) !== '1') {
        setFieldErrors('Country code is required to be 1');
      } else if (newNumber.length > 10) {
        setFieldErrors('We support only US phone numbers ex. +1(234)567-8910');
      } else {
        setFieldErrors('');
      }
    }
  };

  return (
    <div className="update-user-number-view">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      {updateNumberSuccessful ? (
        <div className="user-account-header">
          <p className="title">Phone number was successfully updated!</p>
        </div>
      ) : (
        <>
          <div className="user-account-header">
            <p className="title">Phone Number</p>
            <img src={icon} alt="info" />
            <p>We only support US phone numbers</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="phone-number"
              id="phone-number"
              name="phone-number"
              className="user-data-form"
              placeholder="Phone Number"
              autoFocus
              noValidate
              onChange={(e) => checkingPhoneNumber(e.target.value)}
            />
            {fieldErrors
            ? <p className="inline-error">{fieldErrors}</p> : ''}
            <button className="user-account-update-btn" type="submit">
              Change Phone Number
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UpdateUserNumber;
