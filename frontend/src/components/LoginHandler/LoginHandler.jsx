import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './LoginHandler.scss';
import {
  Redirect,
} from 'react-router-dom';
import {
  useLazyQuery,
} from '@apollo/client';
import { GoogleLogin } from 'react-google-login';

import { LOGIN_LOCAL, LOGIN_GOOGLE } from '../../graphql/graphql';
import LocalStorageTerms from '../../constants/LocalStorageTerms';
import ErrorMessagesGraphQL from '../../constants/ErrorMessagesGraphQL';
import googleIcon from './assets/btn_google_signin_light_normal_web@2x.png';
import microsoftIcon from './assets/microsoft_PNG18.png';
import LoginContext from '../LoginContext/LoginContext';

// global constant options
const OPTIONS = {
  googleClientID: '794344810158-sani885h3b9sksk7oqi0cb3spit2271p.apps.googleusercontent.com',
};

function LoginHandler() {
  const { t } = useTranslation();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [badLoginAttempt, setBadLoginAttempt] = useState(false);
  const [emailExistsOauth, setEmailExistsOauth] = useState(false);
  const [otherError, setOtherError] = useState(false);
  const loginContext = useContext(LoginContext); // holds setSignIn, and signIn props
  const loginLocal = useLazyQuery(LOGIN_LOCAL,
    { onCompleted: (d) => { setData(d); }, onError: (e) => { setError(e); } });
  const loginGoogle = useLazyQuery(LOGIN_GOOGLE,
    { onCompleted: (d) => { setData(d); }, onError: (e) => { setError(e); } });

  const responseGoogle = (response) => {
    console.log(response);
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
    loginGoogle[0]({
      variables: {
        googleToken: response.tokenId,
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
      const localExists = new RegExp(ErrorMessagesGraphQL.LOCAL_EXISTS);

      // setting flags for the type of error
      if (noPass.test(eM) || noEmailPass.test(eM) || noEmail.test(eM)) {
        setBadLoginAttempt(true);
        setEmailExistsOauth(false);
        setOtherError(false);
      } else if (localExists.test(eM)) {
        setEmailExistsOauth(true);
        setBadLoginAttempt(false);
        setOtherError(false);
      } else {
        setOtherError(true);
        setBadLoginAttempt(false);
        setEmailExistsOauth(false);
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
            {emailExistsOauth
              ? <p className="inputError">{t('Email is associated with an account')}</p> : ''}
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
            <a className="passAnchor desktopView" href="#passAnchor">{t('login.body.textSignIn.forgotPass')}</a>
            <button
              className="signInButton"
              type="button"
              value="Sign In"
              onClick={signInHandler}
            >
              {t('navbar.sign-in')}
            </button>
            <a className="passAnchor mobileView" href="#passAnchor">{t('login.body.textSignIn.forgotPass')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginHandler;
