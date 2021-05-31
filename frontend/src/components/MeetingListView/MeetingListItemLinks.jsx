/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import useCSVUpload from '../../hooks/useCSVUpload';
import useDeleteMeeting from '../../hooks/useDeleteMeeting';

// Asset imports
import {
  CalendarTodayIcon,
  ViewAgendaIcon,
  FormatListNumberedIcon,
  PlayWithCircleOutlineIcon,
  DeleteIcon,
} from '../../utils/_icons';

function AdminMeetingItemLinks({ meeting }) {
  const { t } = useTranslation();
  const [openModal, renderUploadModal] = useCSVUpload(meeting.id);
  const [openDeleteModal, DeleteModal] = useDeleteMeeting(meeting);

  return (
    <div className="meeting-links">
      <Link to="#">
        <button
          type="button"
          className="link"
          onClick={openModal}
        >
          <ViewAgendaIcon />
          <p>{t('meeting.actions.upload-new-agenda')}</p>
        </button>
      </Link>
      <Link to="#">
        <button
          type="button"
          className="link"
          onClick={openDeleteModal}
        >
          <DeleteIcon />
          <p>{t('meeting.list.delete-meeting.button')}</p>
        </button>
      </Link>

      {renderUploadModal()}
      <DeleteModal />
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
