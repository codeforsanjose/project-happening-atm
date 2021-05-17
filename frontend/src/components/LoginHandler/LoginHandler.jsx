import React, { useState } from 'react';
import './LoginHandler.scss';
import {
  useHistory,
} from 'react-router-dom';
import {
  useLazyQuery,
} from '@apollo/client';

import { LOGIN_LOCAL } from '../../graphql/graphql';

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

// setSignedIn is the state setter for the signedIn state variable
function LoginHandler({ setSignedIn }) {
  const [login, { data, error }] = useLazyQuery(LOGIN_LOCAL);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  if (data) {
    window.localStorage.setItem('token', data.loginLocal.token);
    window.localStorage.setItem('signedIn', true);
    setSignedIn(true);
    history.push('/');
  }
  return (
    <div className="LoginHandler">
      <div id="loginHeader">CITY LOGO</div>
      <div id="loginBody">
        <p>
          Welcome to the City of San Jos&eacute;
          <br />
          City Council Meeting Virtual Agenda
        </p>

        <hr id="introTextSeperator" />

        <div className="google-microsoft-login" id="googleLogin" />
        <div className="google-microsoft-login" />

        <div id="or">
          <hr />
          <span>or</span>
          <hr />
        </div>

        <form>
          <input id="localNameLogin" className="localLogin" type="text" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
          {error ? <p>ERROR WRONG PASSWORD AND/OR EMAIL</p> : ''}
          <input className="localLogin" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <a id="passAnchor" href="#passAnchor">Forgot Password?</a>
          <input id="submitButton" type="button" value="Sign In" onClick={() => clickHandler(login, error, userName, password)} />
        </form>

      </div>
    </div>
  );
}

export default LoginHandler;
