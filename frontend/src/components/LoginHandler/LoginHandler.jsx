import React, { useState, useEffect } from 'react';
import './LoginHandler.scss';
import {
  Redirect,
} from 'react-router-dom';
import {
  useLazyQuery,
} from '@apollo/client';
import { GoogleLogin } from 'react-google-login';

import { LOGIN_LOCAL, LOGIN_GOOGLE } from '../../graphql/graphql';
import googleIcon from './assets/btn_google_signin_light_normal_web@2x.png';
import microsoftIcon from './assets/microsoft_PNG18.png';
import LoginContext from '../LoginContext/LoginContext';

// global constant options
const OPTIONS = {
  googleClientID: '794344810158-sani885h3b9sksk7oqi0cb3spit2271p.apps.googleusercontent.com',
};

function LoginHandler() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const loginContext = React.useContext(LoginContext); // holds setSignIn, and signIn props
  const loginLocal = useLazyQuery(LOGIN_LOCAL,
    { onCompleted: (d) => { setData(d); }, onError: (e) => { setError(e); } });
  const loginGoogle = useLazyQuery(LOGIN_GOOGLE,
    { onCompleted: (d) => { setData(d); }, onError: (e) => { setError(e); } });

  const responseGoogle = (response) => {
    console.log(response);
  };

  // This function makes the query call to perform the login
  const localHandler = () => {
    loginLocal[0]({
      variables: {
        email_address: userName,
        password,
      },
    });
  };

  const googleHandler = (response) => {
    window.localStorage.setItem('token', response.tokenId);
    console.log(window.localStorage.getItem('token'));
    // loginGoogle[0]();
  };
  console.log(data);
  /* useEffect(() => {
    // Successful sign in
    if (data) {
      window.localStorage.setItem('token', data.loginLocal.token);
      window.localStorage.setItem('signedIn', true);
      loginContext.setSignedIn(true);
    }
  }, [data, loginContext]); */

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
            <button className="signInButton" type="button" value="Sign In" onClick={localHandler}>Sign In</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginHandler;
