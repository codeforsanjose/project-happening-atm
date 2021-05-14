import React from 'react';
import './LoginHandler.scss';
// setSignedIn is the state setter for the signedIn state variable
function LoginHandler({ setSignedIn }) {
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
          <input id="localNameLogin" className="localLogin" type="text" placeholder="UserName" />
          <input className="localLogin" type="text" placeholder="Password" />
          <a id="passAnchor" href="#passAnchor">Forgot Password?</a>
          <input id="submitButton" type="button" value="Sign In" />
        </form>

      </div>
    </div>
  );
}

export default LoginHandler;
