import React from 'react';
import './ParticipatePage.scss';

function ParticipateWatch() {
  return (
    <div className="ParticipatePage">
      <div className="header">Join Zoom Meeting</div>

      <p>
        To help stop the spread of COVID-19 and keep our
        community safe, the City of San José is currently
        conducting City Council meetings virtually using
        <em>Zoom</em>
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
            Select*9 to &#34Raise Hand&#34 to speak.
            Select *6 to unmute when your name is called.
          </p>
        </li>
        <li>
          <p>Join from your computer or smart device here*</p>
          <button type="button">Join Zoom Meeting</button>
          <p className="info">
            <em>*Zoom Web Browser Requirements</em>
            Must have the application installed. Use a current,
            up-to-date browser: Chrome 30+, Firefox 27+,
            Microsoft Edge 12+, Safari 7+. Certain functionality
            may be disabled in older browsers including Internet
            Explorer. Learn more at zoom.us.
          </p>

          <p className="info">
            For more information on how to join a meeting, click here.
          </p>
        </li>
      </ol>
    </div>
  );
}

export default ParticipateWatch;
