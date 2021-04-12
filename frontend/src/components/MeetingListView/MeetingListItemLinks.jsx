/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className="meeting-links">
      <Link to="#">
        <div className="link">
          <ViewAgendaIcon />
          <p>{t('meeting.actions.upload-new-agenda')}</p>
        </div>
      </Link>
      <Link to="#">
        <div className="link">
          <DeleteIcon />
          <p>{t('meeting.list.delete-meeting.button')}</p>
        </div>
      </Link>
    </div>
  );
}

function PastMeetingItemLinks() {
  const { t } = useTranslation();

  return (
    <div className="meeting-links">
      <Link to="#">
        <div className="link">
          <FormatListNumberedIcon />
          <p>{t('meeting.list.minutes.button')}</p>
        </div>
      </Link>
      <Link to="#">
        <div className="link">
          <PlayWithCircleOutlineIcon />
          <p>{t('meeting.list.recording.button')}</p>
        </div>
      </Link>
    </div>
  );
}

function PendingMeetingItemLinks({ meetingId, isInProgress }) {
  const { t } = useTranslation();

  return (
    <div className="meeting-links">
      <Link to="#" className={classnames({ 'disabled-link': isInProgress })}>
        <div className="link">
          <CalendarTodayIcon />
          <p>{t('meeting.list.calendar-export.button')}</p>
        </div>
      </Link>
      <Link to={`meeting/${meetingId}`}>
        <div className="link">
          <ViewAgendaIcon />
          <p>{t('meeting.list.agenda.button')}</p>
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
