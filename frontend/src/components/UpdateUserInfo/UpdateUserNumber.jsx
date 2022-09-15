import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { getUserId } from "../../utils/verifyToken";
import { UPDATE_PHONE_NUMBER } from "../../graphql/userAccount";
import {
  isNullOrEmpty, isNumericString
} from '../../utils/validations';

// Component imports
import NavBarHeader from "../NavBarHeader/NavBarHeader";
import { CancelIcon, InfoIcon } from '../../utils/_icons';
import "../UserAccountView/UserAccountView.scss";

// TODO: fix validation, issues with input length
// TODO: update to use correct form pattern
// TODO: update input to show number as (xxx) xxx-xxxx
const UpdateUserNumber = () => {
  const [navToggled, setNavToggled] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [fieldErrors, setFieldErrors] = useState(null);
  const [updateNumberSuccessful, setUpdateNumberSuccessful] = useState(false);
  const [showInfo, setShowInfo] = useState(false)
  const [updatePhoneNumber] = useMutation(UPDATE_PHONE_NUMBER);

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  const handleShowInfo = () => {
    setShowInfo(prevShowInfo => !prevShowInfo)
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
            {showInfo && 
              <span className='info-message'>We only support US phone numbers</span>
            }
            <button className='info-button' onClick={handleShowInfo}>
              <span className='sr-only'>Info</span>
              <InfoIcon/>
            </button>
          </div>

          <form>
            <div>
              <input
                type="tel"
                id="phone-number"
                name="phone-number"
                className="form-input"
                placeholder="Phone Number"
                autoFocus
                noValidate
                onChange={(e) => checkingPhoneNumber(e.target.value)}
              />
              {newNumber &&
                <button type='button' className='clear-form-input'>
                  <span className='sr-only'>Clear phone number</span>
                  <CancelIcon/>
                </button>
              }
            </div>
            {fieldErrors
            ? <p className="inline-error">{fieldErrors}</p> : ''}
            <button className={`user-account-update-btn${fieldErrors || !newNumber ? ' disabled' : ''}`}
              type="button"
              onClick={(!fieldErrors && newNumber) && handleSubmit}
              disabled={fieldErrors ? true : false}
            >
              Change Phone Number
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UpdateUserNumber;
