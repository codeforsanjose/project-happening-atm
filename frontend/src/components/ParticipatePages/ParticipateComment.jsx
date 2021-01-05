/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipatePage.scss';

import ParticipateBackNav from './ParticipateBackNav';

function ParticipateComment() {
  return (
    <div className="ParticipatePage responsive-padding">
      <ParticipateBackNav />

      <div className="ParticipateContent">
        <h3 className="ParticipateHeader">Submit Written Public Comment</h3>

        <p className="bold">Before the Meeting</p>

        <ol>
          <li>
            <p>
              Email
              {' '}
              <a href="mailto:city.clerk@sanjoseca.gov">city.clerk@sanjoseca.gov</a>
              {' '}
              by 10:00 a.m. the day of the meeting.
            </p>
            <p className="info">
              Please identify the Agenda Item Number in the subject line of
              your email.
              Emails will be attached to the Council Item under &quot;Letters
              from the Public,&quot; but will not be read aloud during the
              meeting.
            </p>
          </li>
          <li>
            <p>Via eComment link</p>
            <p className="info">
              eComments are directly sent to Council and Committee staff.
            </p>
            <Link to="/">
              <button type="button">Send eComment</button>
            </Link>
          </li>
        </ol>

        <p className="bold">During the Meeting</p>

        <ol>
          <li>
            <p>
              Email
              {' '}
              <a href="mailto:councilmeeting@sanjoseca.gov">councilmeeting@sanjoseca.gov</a>
              {' '}
              during the meeting.
            </p>
            <p className="info">
              Please identify the Agenda Item Number in the subject line of
              your email.
              Comments received will be included as a part of the meeting
              record but will not be read aloud during the meeting.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default ParticipateComment;
