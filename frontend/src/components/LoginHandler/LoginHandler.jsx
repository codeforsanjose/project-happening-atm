import React, { useState, useEffect } from 'react';
import './LoginHandler.scss';
import {
  Redirect,
} from 'react-router-dom';
import {
  useLazyQuery,
} from '@apollo/client';

import { LOGIN_LOCAL } from '../../graphql/graphql';
import googleIcon from './assets/btn_google_signin_light_normal_web@2x.png';
import microsoftIcon from './assets/microsoft_PNG18.png';
import LoginContext from '../LoginContext/LoginContext';

function LoginHandler() {
  const [login, { data, error }] = useLazyQuery(LOGIN_LOCAL);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const loginContext = React.useContext(LoginContext); // holds setSignIn, and signIn props

  // This function makes the query call to perform the login
  const clickHandler = () => {
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
      window.localStorage.setItem('token', data.loginLocal.token);
      window.localStorage.setItem('signedIn', true);
      loginContext.setSignedIn(true);
    }
  }, [data, loginContext]);

  return (
    <div className="LoginHandler">
      {loginContext.signedIn ? <Redirect to="/" /> : ''}
      <div className="loginHeader">CITY LOGO</div>
      <div className="loginBody">
        <div className="innerWrapper">
          <p>
            Welcome to the City of San Jos&eacute;
            <br />
            City Council Meeting Virtual Agenda
          </p>

          <hr className="introTextSeperator" />

          <div className="google-microsoft-login googleLogin">
            <img
              src={googleIcon}
              alt="googleLogin"
            />
            <span>Sign In with Google</span>

          </div>
          <div className="google-microsoft-login">
            <img
              src={microsoftIcon}
              alt="microsoftLogin"
            />
            <span>Sign In with Microsoft</span>
          </div>

          <div className="or">
            <hr />
            <span>or</span>
            <hr />
          </div>

          <div className="inputWrapper">
            {error ? <p className="inputError">ERROR WRONG PASSWORD AND/OR EMAIL</p> : ''}
            <input className="localLogin localNameLogin" type="text" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input className="localLogin" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <a className="passAnchor" href="#passAnchor">Forgot Password?</a>
            <button className="signInButton" type="button" value="Sign In" onClick={clickHandler}>Sign In</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginHandler;
