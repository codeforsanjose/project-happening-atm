/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import { toDateString, toTimeString } from '../../utils/timestampHelper';
import './MeetingListItem.scss';

import { CalendarTodayIcon, ViewAgendaIcon } from '../../utils/_icons';

function MeetingListItem({ item }) {
  // eslint-disable-next-line camelcase
  const { id, meeting_start_timestamp } = item;
  const date = toDateString(meeting_start_timestamp);
  const time = toTimeString(meeting_start_timestamp);

  // show minutes/recording if meeting is in the past
  // show admin controls if user is admin
  // disable export link if meeting is in progress

  return (
    <Link to={`meeting/${id}`} className="MeetingListItem">
      <div className="wrapper">
        <h3 className="meeting-date">{date}</h3>
        <div className="meeting-time">{time}</div>
        <div className="meeting-links">
          <Link to="#">
            <div className="link">
              <CalendarTodayIcon />
              <p>Export to Calendar</p>
            </div>
          </Link>
          <Link to="#">
            <div className="link">
              <ViewAgendaIcon />
              <p>Agenda</p>
            </div>
          </Link>
        </div>
      </div>
    </Link>
  );
}

export default MeetingListItem;
