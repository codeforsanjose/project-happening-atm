/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipatePage.scss';

import { ChevronLeftIcon } from '../../utils/_icons';

function ParticipateComment() {
  return (
    <div className="ParticipatePage">
      <div className="ParticipateNav">
        <Link to="/" className="back">
          <ChevronLeftIcon />
          <p>Back</p>
        </Link>
      </div>

      <div className="ParticipateContent">
        <h2 className="ParticipateHeader">Submit Written Public Comment</h2>

        <p className="bold">Before the Meeting</p>

        <ol>
          <li>
            <p>
              Email
              {' '}
              <a href="#">city.clerk@sanjoseca.gov</a>
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
              <a href="#">councilmeeting@sanjoseca.gov</a>
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
