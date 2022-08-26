import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './LoginHandler.scss';
import {
  Redirect, NavLink,
} from 'react-router-dom';
import {
  useLazyQuery,
} from '@apollo/client';
import { GoogleLogin } from 'react-google-login';
import MicrosoftLogin from 'react-microsoft-login';

import { LOGIN_LOCAL, LOGIN_GOOGLE, LOGIN_MICROSOFT } from '../../graphql/graphql';
import LocalStorageTerms from '../../constants/LocalStorageTerms';
import ErrorMessagesGraphQL from '../../constants/ErrorMessagesGraphQL';
import googleIcon from './assets/btn_google_signin_light_normal_web@2x.png';
import microsoftIcon from './assets/microsoft_PNG18.png';
import LoginContext from '../LoginContext/LoginContext';
import CLIENT_ID from '../../constants/OauthClientID';

// global constant options
const OPTIONS = {
  googleClientID: CLIENT_ID.GOOGLE,
  microsoftClientID: CLIENT_ID.MICROSOFT,
};

function LoginHandler() {
  const { t } = useTranslation();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [badLoginAttempt, setBadLoginAttempt] = useState(false);
  const [otherError, setOtherError] = useState(false);
  const loginContext = useContext(LoginContext); // holds setSignIn, and signIn props
  const loginLocal = useLazyQuery(LOGIN_LOCAL,
    { onCompleted: (d) => { setData(d); }, onError: (e) => { setError(e); } });
  const loginGoogle = useLazyQuery(LOGIN_GOOGLE,
    { onCompleted: (d) => { setData(d); }, onError: (e) => { setError(e); }, fetchPolicy: 'network-only' });
  const loginMicrosoft = useLazyQuery(LOGIN_MICROSOFT,
    { onCompleted: (d) => { setData(d); }, onError: (e) => { setError(e); }, fetchPolicy: 'network-only' });

  // needed to fix an infinite looping problem with microsoft oauth and microsoft-react-login
  const { sessionStorage } = window;
  sessionStorage.clear();

  // Response if the google connection attempt failed
  const responseGoogle = (response) => {
    setOtherError(true);
  };

  const microsoftHandler = (err, response) => {
    if (err === null) {
      localStorage.setItem(LocalStorageTerms.TOKEN, response.idToken.rawIdToken);
      loginMicrosoft[0]();
    } else {
      setOtherError(true);
    }
  };

  // This function makes the query call to perform the login
  const signInHandler = () => {
    loginLocal[0]({
      variables: {
        email_address: userName,
        password,
      },
    });
  };

  const googleHandler = (response) => {
    localStorage.setItem(LocalStorageTerms.TOKEN, response.tokenId);
    loginGoogle[0]();
  };

  useEffect(() => {
    // Successful sign in
    if (data) {
      let userEmail;
      if (Object.prototype.hasOwnProperty.call(data, 'loginGoogle')) {
        window.localStorage.setItem(LocalStorageTerms.TOKEN, data.loginGoogle.token);
        userEmail = data.loginGoogle.email;
      }
      if (Object.prototype.hasOwnProperty.call(data, 'loginLocal')) {
        window.localStorage.setItem(LocalStorageTerms.TOKEN, data.loginLocal.token);
        userEmail = data.loginLocal.email || userName;
      }
      if (Object.prototype.hasOwnProperty.call(data, 'loginMicrosoft')) {
        window.localStorage.setItem(LocalStorageTerms.TOKEN, data.loginMicrosoft.token);
        userEmail = data.loginMicrosoft.email
      }
      window.localStorage.setItem(LocalStorageTerms.SIGNED_IN, true);

      loginContext.setSignedIn(true);
      window.localStorage.setItem("email_address", userEmail)
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
      {loginContext.signedIn ? <Redirect to={{ pathname: "/", state: { email_address: userName } }} /> : ''}
      <div className="loginHeader">{t('login.header.cityLogo')}</div>
      <div className="loginBody">
        <div className="innerWrapper">
          <p>
            {t('login.body.header.welcomeToCity')}
            <br />
            {t('login.body.header.cityCouncil')}
          </p>

          <hr className="introTextSeparator" />

          <GoogleLogin
            clientId={OPTIONS.googleClientID}
            render={(renderProps) => (
              <button className="google-microsoft-login googleLogin" type="button" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                <img
                  src={googleIcon}
                  alt="googleLogin"
                />
                <span>Sign In with Google</span>
              </button>
            )}
            buttonText="Login"
            onSuccess={googleHandler}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
          />
          <MicrosoftLogin clientId={OPTIONS.microsoftClientID} authCallback={microsoftHandler}>
            <button className="google-microsoft-login microsoftLogin" type="button">
              <img
                src={microsoftIcon}
                alt="microsoftLogin"
              />
              <span>{t('login.body.oauth.microsoft')}</span>
            </button>
          </MicrosoftLogin>

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
          </div>
          <div className="create-account-container">
            <span>{t('createAccount.span')}</span>
            <NavLink className="nav-account-create" to="/account-create/">{t('createAccount.link')}</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginHandler;
