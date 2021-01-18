import React from 'react';

function ParticipateWatch() {
  return (
    <div className="ParticipatePage">
      <div className="ParticipateContent">
        <h3 className="ParticipateHeader">Watch Meeting Broadcast</h3>

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
            <a
              href="https://www.youtube.com/CityOfSanJoseCalifornia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button">Go to YouTube</button>
            </a>
          </li>
          <li>
            <p>City&apos;s Website</p>
            <p className="info">
              Find the meeting and click on &quot;In Progress&quot; or
              &quot;Currently in Session&quot; to watch.
            </p>
            <a
              href="https://www.sanjoseca.gov/news-stories/watch-a-meeting"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button">Go to the City&apos;s Website</button>
            </a>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default ParticipateWatch;
