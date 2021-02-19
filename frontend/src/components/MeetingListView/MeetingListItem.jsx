/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import { toDateString, toTimeString } from '../../utils/timestampHelper';
import './MeetingListItem.scss';

import { CalendarTodayIcon, ViewAgendaIcon } from '../../utils/_icons';

function MeetingListItem({ item }) {
  const { id, startTime } = item;
  const date = toDateString(startTime);
  const time = toTimeString(startTime);

  return (
    <div className="MeetingListItem">
      <h3 className="meeting-date">{date}</h3>
      <div className="meeting-time">{time}</div>
      <div className="meeting-links">
        <Link to="#">
          <div className="link">
            <CalendarTodayIcon />
            <p>Export to Calendar</p>
          </div>
        </Link>
        <Link to={`meeting/${id}`} className="disabled-link">
          <div className="link">
            <ViewAgendaIcon />
            <p>Agenda</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MeetingListItem;
