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
import ThemeContext from '../ThemeContext/ThemeContext';

// This function makes the query call to perform the login
const clickHandler = (login, error, userName, password) => {
  /* login({
    variables: {
      email_address: 'a@abc.com',
      password: '12345',
    },
  }); */

  login({
    variables: {
      email_address: userName,
      password,
    },
  });
};

function LoginHandler() {
  const [login, { data, error }] = useLazyQuery(LOGIN_LOCAL);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const contextType = React.useContext(ThemeContext); // holds setSignIn, and signIn props

  useEffect(() => {
    // Successful sign in
    if (data) {
      window.localStorage.setItem('token', data.loginLocal.token);
      window.localStorage.setItem('signedIn', true);
      contextType.setSignedIn(true);
    }
  }, [data, contextType]);

  return (
    <div className="LoginHandler">
      {contextType.signedIn ? <Redirect to="/" /> : ''}
      <div id="loginHeader">CITY LOGO</div>
      <div id="loginBody">
        <div className="innerWrapper">
          <p>
            Welcome to the City of San Jos&eacute;
            <br />
            City Council Meeting Virtual Agenda
          </p>

          <hr id="introTextSeperator" />

          <div className="google-microsoft-login" id="googleLogin">
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

          <div id="or">
            <hr />
            <span>or</span>
            <hr />
          </div>

          <form>
            {error ? <p className="inputError">ERROR WRONG PASSWORD AND/OR EMAIL</p> : ''}
            <input id="localNameLogin" className="localLogin" type="text" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input className="localLogin" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <a id="passAnchor" href="#passAnchor">Forgot Password?</a>
            <input id="submitButton" type="button" value="Sign In" onClick={() => clickHandler(login, error, userName, password)} />
          </form>

        </div>
      </div>
    </div>
  );
}

export default LoginHandler;
