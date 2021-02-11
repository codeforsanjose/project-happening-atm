/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function ParticipateJoin() {
  const { t } = useTranslation();

  return (
    <div className="ParticipateContent">
      <h3 className="ParticipateHeader">{t('meeting.tabs.participate.section.join.title')}</h3>

      <p>
        {/* TODO #127: Figure out how we're going to translate interactive texts */}
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
          {/* TODO: Add phone number, zoom meeting id, and link to join zoom meeting
          https://github.com/codeforsanjose/gov-agenda-notifier/issues/103 */}
          <p>Call ###-###-####</p>
          <p className="info">
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            Enter Meeting ID ### #### ####
            Select *9 to &#34;Raise Hand&#34; to speak.
            Select *6 to unmute when your name is called.
          </p>
        </li>
        <li>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <p>{t('meeting.tabs.participate.section.join.description.number-2.title')}*</p>
          <Link to="/">
            <button type="button">{t('meeting.tabs.participate.section.join.description.number-2.button')}</button>
          </Link>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <p className="info bold">*{t('meeting.tabs.participate.section.join.description.post-script.title')}</p>
          <p className="info">
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            /Users/Sepehr/Documents/CodingProjects/code-for-san-jose/gov-agenda-notifier/frontend/src/components/MeetingView/ParticipateView/OldParticipatePages/ParticipateJoin.jsx
            Must have the application installed. Use a current,
            up-to-date browser: Chrome 30+, Firefox 27+,
            Microsoft Edge 12+, Safari 7+. Certain functionality
            may be disabled in older browsers including Internet
            Explorer. Learn more at
            {' '}
            <a
              href="https://zoom.us/"
              target="_blank"
              rel="noopener noreferrer"
            >
              zoom.us
            </a>
            .
          </p>

          <p className="info">
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            For more information on how to join a meeting,
            {' '}
            <a
              href="https://support.zoom.us/hc/en-us/articles/201362193-Joining-a-meeting"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here
            </a>
            .
          </p>
        </li>
      </ol>
    </div>
  );
}

export default ParticipateJoin;
