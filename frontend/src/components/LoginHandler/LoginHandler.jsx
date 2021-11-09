import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './LoginHandler.scss';
import {
  Redirect, NavLink
} from 'react-router-dom';
import {
  useLazyQuery,
} from '@apollo/client';

import { LOGIN_LOCAL } from '../../graphql/graphql';
import LocalStorageTerms from '../../constants/LocalStorageTerms';
import ErrorMessagesGraphQL from '../../constants/ErrorMessagesGraphQL';
import googleIcon from './assets/btn_google_signin_light_normal_web@2x.png';
import microsoftIcon from './assets/microsoft_PNG18.png';
import LoginContext from '../LoginContext/LoginContext';

function LoginHandler() {
  const { t } = useTranslation();

  const [login, { data, error }] = useLazyQuery(LOGIN_LOCAL);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [badLoginAttempt, setBadLoginAttempt] = useState(false);
  const [otherError, setOtherError] = useState(false);
  const loginContext = useContext(LoginContext); // holds setSignIn, and signIn props

  // This function makes the query call to perform the login
  const signInHandler = () => {
    login({
      variables: {
        email_address: userName,
        password,
      },
    });
  };

  useEffect(() => {
    // Successful sign in
    if (data) {
      window.localStorage.setItem(LocalStorageTerms.TOKEN, data.loginLocal.token);
      window.localStorage.setItem(LocalStorageTerms.SIGNED_IN, true);
      loginContext.setSignedIn(true);
    }
    if (error) {
      // extracted error message
      const eM = error.message;

      // regExpressions to check error type
      const noEmail = new RegExp(ErrorMessagesGraphQL.BAD_EMAIL);
      const noPass = new RegExp(ErrorMessagesGraphQL.NO_PASSWORD);
      const noEmailPass = new RegExp(ErrorMessagesGraphQL.BAD_EMAIL_PASS);

      // setting flags for the type of error
      if (noPass.test(eM) || noEmailPass.test(eM) || noEmail.test(eM)) {
        setBadLoginAttempt(true);
      } else {
        setBadLoginAttempt(false);
        setOtherError(true);
      }
    }
  }, [data, loginContext, error]);

  return (
    <div className="LoginHandler">
      {loginContext.signedIn ? <Redirect to="/" /> : ''}
      <div className="loginHeader">{t('login.header.cityLogo')}</div>
      <div className="loginBody">
        <div className="innerWrapper">
          <p>
            {t('login.body.header.welcomeToCity')}
            <br />
            {t('login.body.header.cityCouncil')}
          </p>

          <hr className="introTextSeparator" />

          <div className="google-microsoft-login googleLogin">
            <img
              src={googleIcon}
              alt="googleLogin"
            />
            <span>{t('login.body.oauth.google')}</span>

          </div>
          <div className="google-microsoft-login">
            <img
              src={microsoftIcon}
              alt="microsoftLogin"
            />
            <span>{t('login.body.oauth.microsoft')}</span>
          </div>

          <div className="or">
            <hr />
            <span>{t('login.body.or')}</span>
            <hr />
          </div>

          <div className="inputWrapper">
            {badLoginAttempt
              ? <p className="inputError">{t('standard.errors.badEmailPass')}</p> : ''}
            {otherError
              ? <p className="inputError">{t('standard.errors.something-went-wrong')}</p> : ''}
            <input
              className="localLogin localNameLogin"
              type="text"
              placeholder={t('login.body.textSignIn.userName')}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="localLogin"
              type="password"
              placeholder={t('login.body.textSignIn.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <a className="passAnchor desktopView" href="#passAnchor">{t('login.body.textSignIn.forgotPass')}</a> */}
            <NavLink className="passAnchor desktopView" to="/forgot-password">{t('login.body.textSignIn.forgotPass')}</NavLink>
            <button
              className="signInButton"
              type="button"
              value="Sign In"
              onClick={signInHandler}
            >
              {t('navbar.sign-in')}
            </button>
            <NavLink className="passAnchor mobileView" to="/forgot-password">{t('login.body.textSignIn.forgotPass')}</NavLink>
            {/* <a className="passAnchor mobileView" href="#passAnchor">{t('login.body.textSignIn.forgotPass')}</a> */}
          </div>
          <div className="create-account-container">
            <span>{t('createAccount.span')}</span><NavLink className="nav-account-create" to="/account-create/">{t('createAccount.link')}</NavLink>
          </div>     
        </div>
      </div>
    </div>
  );
}

export default LoginHandler;
