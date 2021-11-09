import React, { useEffect, useState, useContext } from 'react';
import './AccountCreate.styles.scss';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { GET_ACCOUNT_BY_EMAIL, LOGIN_LOCAL, CREATE_ACCOUNT } from '../../graphql/graphql';
import LocalStorageTerms from '../../constants/LocalStorageTerms';
import LoginContext from '../LoginContext/LoginContext';
import UserRoles from '../../constants/UserRoles';
import { InfoIcon } from '../../utils/_icons';
import {
  isNullOrEmpty, isNumericString, validEmail, isPasswordValid,
} from '../../utils/validations';

function AccountCreate() {

  // TODO: Add Site key.
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const PASSWORD_TEXT = 'Passwords must have 6 characters, a uppercase, a lowercase, a number and a special character ';

  // User specific variables to be sent to backend.
  const [userInfo, setUserInfo] = useState({
    email_address: '',
    password: '',
    phone_number: '',
    role: UserRoles.USER,
    captcha_value: '',
  });

  // Signup variables that don't need to be stored in DB.
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error variables for inline field validations
  const [fieldErrors, setFieldErrors] = useState({
    email_address: null,
    password: null,
    confirmPassword: null,
    tos: null,
    captcha_check: null,
  });

  // Signup related variables.
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [getUsers, { data: existingUsersData }] = useLazyQuery(GET_ACCOUNT_BY_EMAIL);

  const [createAccount] = useMutation(
    CREATE_ACCOUNT,
    {
      onCompleted: (createAccountData) => {
        setSignupSuccess(true);
      },
    },
  );

  // Login related variables
  const [login, { data: loginData, error: loginError }] = useLazyQuery(LOGIN_LOCAL);
  const loginContext = useContext(LoginContext); // holds setSignIn, and signIn props

  /* Field Validation functions */

  // Email address validation
  const userExists = () => {
    getUsers({ variables: { email_address: userInfo.email_address } });
  };

  const verifyEmailAddressFormat = () => {
    const currentErrors = { ...fieldErrors };
    const { email_address } = userInfo;
    if (isNullOrEmpty(email_address) || !validEmail(email_address)) {
      currentErrors.email_address = 'Please enter a valid email address';
    } else {
      delete currentErrors.email_address;
    }
    setFieldErrors(currentErrors);
  };

  const validateEmailExists = () => {
    verifyEmailAddressFormat();
    userExists();
  };

  // Confirm Password validation
  const validateConfirmPassword = () => {
    const currentErrors = { ...fieldErrors };
    const { password } = userInfo;
    if (password !== confirmPassword) {
      currentErrors.confirmPassword = 'Passwords do not match';
    } else {
      delete currentErrors.confirmPassword;
    }
    setFieldErrors(currentErrors);
  };

  // Password validation
  const verifyPasswordFormat = () => {
    const currentErrors = { ...fieldErrors };
    const { password } = userInfo;
    if (isNullOrEmpty(password) || !isPasswordValid(password)) {
      currentErrors.password = PASSWORD_TEXT;
    } else {
      delete currentErrors.password;
    }
    setFieldErrors(currentErrors);
    if (confirmPassword) {
      validateConfirmPassword();
    }
  };

  const verifyConfirmPasswordFormat = () => {
    validateConfirmPassword();
  };

  // Phone number field validation
  const verifyPhoneNumberFormat = () => {
    const currentErrors = { ...fieldErrors };
    const { phone_number } = userInfo;
    if (!isNullOrEmpty(phone_number)) {
      if(!isNumericString(phone_number)){
        currentErrors.phone_number = 'Phone number not numeric';
      }
      else if(phone_number.charAt(0) !== '1'){
        currentErrors.phone_number = 'Country code is required to be 1';
      }
      else if (phone_number.length !== 11) {
        currentErrors.phone_number = 'We support only US phone numbers ex. +1(234)567-8910';
      }
      else {
        delete currentErrors.phone_number;
      }
    }
    setFieldErrors(currentErrors);
  };

  // Terms of Service validation
  const verifyTosChecked = (target) => {
    const currentErrors = { ...fieldErrors };
    if (target.checked) {
      delete currentErrors.tos;
    } else {
      currentErrors.tos = 'Please check our terms of service';
    }
    setFieldErrors(currentErrors);
  };

  /* End Field Validation functions */

  /* UseEffect functions */
  useEffect(() => {
    if (existingUsersData) {
      const currentErrors = { ...fieldErrors };
      if (existingUsersData.getAccountByEmail) {
        currentErrors.email_address = 'This mail address is already registered. Please log in instead';
      }
      setFieldErrors(currentErrors);
    }
  }, [existingUsersData]);

  useEffect(() => {
    if (signupSuccess) {
      // Auto login the new user into the app.
      login({
        variables: {
          email_address: userInfo.email_address,
          password: userInfo.password,
        },
      });
    }
  }, [signupSuccess, login, userInfo.email_address, userInfo.password]);

  useEffect(() => {
    // Successful sign in
    if (loginData) {
      window.localStorage.setItem(LocalStorageTerms.TOKEN, loginData.loginLocal.token);
      window.localStorage.setItem(LocalStorageTerms.SIGNED_IN, true);
      loginContext.setSignedIn(true);
    }
  }, [loginData, loginContext, loginError]);

  // Erase individual field errors (if shown) when user clicks back into the field
  const eraseFieldError = (element) => {
    const currentErrors = { ...fieldErrors };
    if (element in currentErrors) delete currentErrors[element];
    setFieldErrors(currentErrors);
  };

  // Set input values to user object
  const gatherUserInfo = (target) => {
    const currentUser = { ...userInfo };
    currentUser[target.name] = target.value;
    setUserInfo(currentUser);
  };

  // Handler for create new account button
  const createAccountHandler = () => {

    createAccount({
      variables: {
        email_address: userInfo.email_address,
        password: userInfo.password,
        phone_number: userInfo.phone_number,
        role: userInfo.role,
      },
    });
  };

  const handleCaptcha = () => {
    const captcha = document.querySelector('#g-recaptcha-response').value;
    const currentErrors = { ...fieldErrors };
    if (captcha === undefined || captcha === '' || captcha === null) {
      currentErrors.captcha_check = 'Please select captcha';
    } else {
      delete currentErrors.captcha_check;
      const currentUser = { ...userInfo };
      currentUser.captcha_value = captcha;
      setUserInfo(currentUser);
    }
    setFieldErrors(currentErrors);
  };

  return (
    <div className="main-container">
      {loginContext.signedIn ? <Redirect to="/" /> : ''}
      <div className="page-header">
        <h1>Welcome</h1>
        <p>Create an account to get started</p>
        <hr />
      </div>
      <div className="form-wrapper">

        <div className="form-fields">
          <label htmlFor="email_address">Email (this will be your username)</label>
          <input
            type="email"
            id="email_address"
            name="email_address"
            placeholder="*"
            className={fieldErrors.email_address ? 'input-error' : ''}
            value={userInfo.email_address}
            autoFocus
            noValidate
            onChange={(e) => gatherUserInfo(e.target)}
            onBlur={validateEmailExists}
            onFocus={(e) => eraseFieldError(e.target.name)}
          />
          {fieldErrors.email_address
            ? <p className="inline-error">{fieldErrors.email_address}</p> : ''}
        </div>

        <div className="form-fields">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="*"
            className={fieldErrors && fieldErrors.password ? 'input-error' : ''}
            value={userInfo.password}
            noValidate
            onBlur={verifyPasswordFormat}
            onChange={(e) => gatherUserInfo(e.target)}
            onFocus={(e) => eraseFieldError(e.target.name)}
          />
          {fieldErrors && fieldErrors.password
            ? <p className="inline-error">{fieldErrors.password}</p> : ''}
        </div>

        <div className="form-fields">
          <label htmlFor="confirmPassword">Re-enter Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="*"
            className={fieldErrors && fieldErrors.confirmPassword ? 'input-error' : ''}
            value={confirmPassword}
            noValidate
            onBlur={verifyConfirmPasswordFormat}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={(e) => eraseFieldError(e.target.name)}
          />
          {fieldErrors && fieldErrors.confirmPassword
            ? <p className="inline-error">{fieldErrors.confirmPassword}</p> : ''}
        </div>

        <div className="form-fields">
          <div className="phone-mark">
            <label htmlFor="phone_number">Phone (optional)</label>
            <div className="tooltip-wrapper">
              <InfoIcon />
              <span className="tooltiptext">We support only US phone numbers</span>
            </div>
          </div>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            className={fieldErrors && fieldErrors.phone_number ? 'input-error' : ''}
            value={userInfo.phone_number || ''}
            noValidate
            onChange={(e) => gatherUserInfo(e.target)}
            onBlur={verifyPhoneNumberFormat}
            onFocus={(e) => eraseFieldError(e.target.name)}
          />
          {fieldErrors && fieldErrors.phone_number
            ? <p className="inline-error">{fieldErrors.phone_number}</p> : ''}
        </div>

        <div className="form-fields">
          <div className="form-check">
            <input
              type="checkbox"
              id="tos"
              name="tos"
              className="tos-input"
              onChange={(e) => verifyTosChecked(e.target)}
              onBlur={(e) => verifyTosChecked(e.target)}
            />
            <label htmlFor="tos"> I have read, understood and agreed with your Terms of Service and Privacy Policy</label>
            <label style={{ color:'red' }}>*</label>
          </div>
          {fieldErrors && fieldErrors.tos
            ? <p className="inline-error">{fieldErrors.tos}</p> : ''}
        </div>

        <div className="form-fields">
          <div className="g-recaptcha">
            <ReCAPTCHA
              size="normal"
              data-theme="dark"
              render="explicit"
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptcha}
            />
            <label style={{ color:'red' }}>*</label>
            {fieldErrors && fieldErrors.captcha_check
              ? <p className="inline-error">{fieldErrors.captcha_check}</p> : ''}
          </div>
        </div>

        <div className="form-fields">
          <button
            type="submit"
            className="signup-cta"
            value="create"
            disabled={Object.entries(fieldErrors || {}).length > 0}
            onClick={createAccountHandler}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountCreate;
