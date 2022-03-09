/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import useCSVUpload from '../../hooks/useCSVUpload';
import useDeleteMeeting from '../../hooks/useDeleteMeeting';
import { isFutureTimestamp } from '../../utils/timestampHelper';
import '../../utils/generalStyles.scss';

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
  const [openUploadModal, UploadModal] = useCSVUpload(meeting);
  const [openDeleteModal, DeleteModal] = useDeleteMeeting(meeting);

  const isFutureItem = isFutureTimestamp(meeting.meeting_start_timestamp);
  const pastClasses = 'meeting-links visibility-hidden';
  const futureClasses = 'meeting-links';

  return (
    <div className={isFutureItem ? futureClasses : pastClasses}>
      <Link to="#">
        <button
          type="button"
          className="link"
          onClick={openUploadModal}
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

      <UploadModal />
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

function PendingMeetingItemLinks({ meeting, isInProgress }) {
  const { t } = useTranslation();

  return (
    <div className="meeting-links">
      <Link to="#" className={classnames({ 'disabled-link': isInProgress })}>
        <div className="link">
          <CalendarTodayIcon />
          <p>{t('meeting.list.calendar-export.button')}</p>
        </div>
      </Link>
      <Link to={`meeting/${meeting.id}`}>
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
