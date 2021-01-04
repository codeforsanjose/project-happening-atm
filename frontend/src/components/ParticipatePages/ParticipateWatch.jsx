import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipatePage.scss';

import ParticipateBackNav from './ParticipateBackNav';

function ParticipateWatch() {
  return (
    <div className="ParticipatePage">
      <ParticipateBackNav />

      <div className="ParticipateContent">
        <h2 className="ParticipateHeader">Watch Meeting Broadcast</h2>

        <p>
          You have 3 options to watch the live meeting broadcast:
        </p>

        <p className="info">
          Closed Captioning is available for all
        </p>

        <ol>
          <li>
            <p>Comcast Cable Channel 26</p>
          </li>
          <li>
            <p>City&apos;s YouTube Channel</p>
            <Link to="/">
              <button type="button">Go to YouTube</button>
            </Link>
          </li>
          <li>
            <p>City&apos;s Website</p>
            <p className="info">
              Find the meeting and click on &quot;In Progress&quot; or
              &quot;Currently in Session&quot; to watch.
            </p>
            <Link to="/">
              <button type="button">Go to the City&apos;s Website</button>
            </Link>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default ParticipateWatch;
