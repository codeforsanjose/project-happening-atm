/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipatePage.scss';

import { ChevronLeftIcon } from '../../utils/_icons';

function ParticipateRequest() {
  return (
    <div className="ParticipatePage">
      <div className="ParticipateNav">
        <Link to="/" className="back">
          <ChevronLeftIcon />
          <p>Back</p>
        </Link>
      </div>

      <div className="ParticipateContent">
        <h2 className="ParticipateHeader">
          Request Separate Consideration of a Consent Calendar Item
        </h2>

        <p>
          There will be no separate discussion of Consent Calendar items as
          they are considered to be routine by the City Council and will be
          adopted by one motion. If a member of the City Council, staff, or
          public requests discussion on a particular item, that item may be
          removed from the Consent Calendar and considered separately.
        </p>

        <p>
          If you wish to request separate discussion on a particular item
          of the consent calendar:
        </p>

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
              Please identify the Consent Calendar Agenda Item Number in the
              subject line of your email.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default ParticipateRequest;