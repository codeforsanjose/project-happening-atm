/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

// Asset imports
import {
  CalendarTodayIcon,
  ViewAgendaIcon,
  FormatListNumberedIcon,
  PlayWithCircleOutlineIcon,
  DeleteIcon,
} from '../../utils/_icons';

function AdminMeetingItemLinks() {
  return (
    <div className="meeting-links">
      <Link to="#">
        <div className="link">
          <ViewAgendaIcon />
          <p>Upload New Agenda</p>
        </div>
      </Link>
      <Link to="#">
        <div className="link">
          <DeleteIcon />
          <p>Delete Meeting</p>
        </div>
      </Link>
    </div>
  );
}

function PastMeetingItemLinks() {
  return (
    <div className="meeting-links">
      <Link to="#">
        <div className="link">
          <FormatListNumberedIcon />
          <p>Minutes</p>
        </div>
      </Link>
      <Link to="#">
        <div className="link">
          <PlayWithCircleOutlineIcon />
          <p>Recording</p>
        </div>
      </Link>
    </div>
  );
}

function PendingMeetingItemLinks({ meetingId, isInProgress }) {
  return (
    <div className="meeting-links">
      <Link to="#" className={classnames({ 'disabled-link': isInProgress })}>
        <div className="link">
          <CalendarTodayIcon />
          <p>Export to Calendar</p>
        </div>
      </Link>
      <Link to={`meeting/${meetingId}`}>
        <div className="link">
          <ViewAgendaIcon />
          <p>Agenda</p>
        </div>
      </Link>
    </div>
  );
}

export {
  AdminMeetingItemLinks,
  PastMeetingItemLinks,
  PendingMeetingItemLinks,
};
