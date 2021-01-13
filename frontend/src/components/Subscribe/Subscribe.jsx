import React, { useState } from 'react';
import './Subscribe.scss';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';
import BackNavigation from '../BackNavigation/BackNavigation';
import Spinner from '../Spinner/Spinner';
import CustomInput from '../CustomInput/CustomInput';
import {
  UncheckedCheckboxWithInnerShadowAndBronzeBorderIcon,
  CheckedCheckboxWithInnerShadowIcon,
} from '../../utils/_icons';
import {
  validatePhone,
  validateEmail,
} from './validation';

/**
 * This is the component for community member subscribe page.
 *
 * props:
 *    createSubscription
 *      The function that creates a subscription on the server
 *    isLoading
 *      A boolean values that indicates whether the communication with the server is in progress
 *    error
 *      An error object returned from the server if there is any error
 *    isSubscribed
 *      A boolean value that indicates whether the subscription has been created successfully
 *
 *
 * state:
 *    isPhoneChecked
 *      A boolean value that indicates whether a checkbox associated with phone field is checked
 *    isEmailChecked
 *      A boolean value that indicates whether a checkbox associated with email field is checked
 *    isFormSubmitted
 *      A boolean value that indicates whether the form has been submitted
 *    phone
 *      A string value that stores the entered user's phone
 *    email
 *      A string value that stores the entered user's email
 *    phoneError
 *      A validation error for phone
 *    emailError
 *      A validation error for email
 */

function Subscribe({
  createSubscription,
  isLoading,
  error,
  isSubscribed,
}) {
  const { meetingId, itemId } = useParams();
  const [isPhoneChecked, setPhoneChecked] = useState(false);
  const [isEmailChecked, setEmailChecked] = useState(false);
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneError, setPhoneError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const handlePhoneChecked = () => {
    setPhoneChecked(!isPhoneChecked);
  };

  const handleEmailChecked = () => {
    setEmailChecked(!isEmailChecked);
  };

  const handlePhoneChanged = (e) => {
    setPhone(e.target.value);
    if (e.target.value) {
      // Check phone checkbox by default if the phone is entered (not empty).
      setPhoneChecked(true);
    }
  };

  const handleEmailChanged = (e) => {
    setEmail(e.target.value);
    if (e.target.value) {
      // Check email checkbox by default if the email is entered (not empty).
      setEmailChecked(true);
    }
  };

  const handleSubmit = (e) => {
    setFormSubmitted(true);
    const phoneValidationError = validatePhone(phone);
    const emailValidationError = validateEmail(email);
    if (phoneValidationError !== null || emailValidationError !== null) {
      if (phoneValidationError) {
        setPhoneError(phoneValidationError);
      }
      if (emailValidationError) {
        setEmailError(emailValidationError);
      }
      // Form is not valid, do not continue.
      return;
    }
    e.preventDefault();

    createSubscription({
      variables: {
        phone_number: phone,
        email_address: email,
        meeting_id: parseInt(meetingId, 10),
        meeting_item_id: parseInt(itemId, 10),
      },
    });
  };

  return (
    <div className={classnames('subscribe-view')}>
      <BackNavigation />
      <div className="wrapper">
        <div className="text">
          <h3>Subscribe to item</h3>
          <p>
            Subscribe to receive a notification when this item is up next
            for discussion and when discussions for this item begin.
          </p>
          <form className="form">
            <div className="input-group">
              <button
                type="button"
                className="checkbox"
                onClick={handlePhoneChecked}
              >
                {isPhoneChecked
                  ? <CheckedCheckboxWithInnerShadowIcon />
                  : <UncheckedCheckboxWithInnerShadowAndBronzeBorderIcon />}
                <span>Subscribe to text notifications</span>
              </button>
              <CustomInput
                type="tel"
                placeholder="Enter phone number"
                isRequired={isPhoneChecked}
                isSubmitted={isFormSubmitted}
                value={phone}
                onChange={handlePhoneChanged}
                errorMessage={phoneError}
              />
            </div>
            <div className="input-group">
              <button
                type="button"
                className="checkbox"
                onClick={handleEmailChecked}
              >
                {isEmailChecked
                  ? <CheckedCheckboxWithInnerShadowIcon />
                  : <UncheckedCheckboxWithInnerShadowAndBronzeBorderIcon />}
                <span>Subscribe to email notifications</span>
              </button>
              <CustomInput
                type="email"
                placeholder="Enter email address"
                isRequired={isEmailChecked}
                isSubmitted={isFormSubmitted}
                value={email}
                onChange={handleEmailChanged}
                errorMessage={emailError}
              />
            </div>
            { error
              && (
                <div className="form-error">{ error.message }</div>
              )}
            <div className="row">
              <button
                type="button"
                disabled={!isPhoneChecked || !isEmailChecked || !phone || !email}
                onClick={handleSubmit}
              >
                {isLoading && <Spinner />}
                {`Subscrib${isLoading ? 'ing...' : 'e'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
