/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';

function ParticipateJoin() {
  return (
    <div className="ParticipateContent">
      <h3 className="ParticipateHeader">Join the Virtual Meeting</h3>

      <p>
        To help stop the spread of COVID-19 and keep our
        community safe, the City of San José is currently
        conducting City Council meetings virtually using
        <span className="bold"> Zoom</span>
        .
      </p>

      <p>
        You have 2 options to join and provide spoken
        comment in the virtual meeting:
      </p>

      <ol>
        <li>
          <p>Call ###-###-####</p>
          <p className="info">
            Enter Meeting ID ### #### ####
            Select *9 to &#34;Raise Hand&#34; to speak.
            Select *6 to unmute when your name is called.
          </p>
        </li>
        <li>
          <p>Join from your computer or smart device here*</p>
          <Link to="/">
            <button type="button">Join Zoom Meeting</button>
          </Link>
          <p className="info bold">*Zoom Web Browser Requirements</p>
          <p className="info">
            Must have the application installed. Use a current,
            up-to-date browser: Chrome 30+, Firefox 27+,
            Microsoft Edge 12+, Safari 7+. Certain functionality
            may be disabled in older browsers including Internet
            Explorer. Learn more at
            {' '}
            <a href="#">zoom.us</a>
            .
          </p>

          <p className="info">
            For more information on how to join a meeting,
            {' '}
            <a href="#">click here</a>
            .
          </p>
        </li>
      </ol>
    </div>
  );
}

export default ParticipateJoin;
