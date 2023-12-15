import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { toDateString, toTimeString } from '../../utils/timestampHelper';
import './MeetingListItem.scss';
import { StatusInProgress } from '../../utils/_icons';
import isAdmin from '../../utils/isAdmin';

// Component imports
import {
  AdminMeetingItemLinks,
  PastMeetingItemLinks,
  PendingMeetingItemLinks,
} from './MeetingListItemLinks';

/**
 * A meeting displayed as an accordion sub item.
 *
 * props:
 *    item
 *      Object that represents a meeting item.
 *      {
 *        id: Number id of item
 *        meeting_start_timestamp: String starting timestamp (Unix time)
 *        status: String status of item - ['PENDING', 'IN PROGRESS', 'CLOSED']
 *      }
 */

function MeetingListItem({ item }) {
  const { t } = useTranslation();
  // eslint-disable-next-line camelcase
  const { id, meeting_start_timestamp, status } = item;
  const date = toDateString(meeting_start_timestamp, 'dddd, MMM D');
  const time = toTimeString(meeting_start_timestamp);
  const isInProgress = status === 'IN PROGRESS';
  const isEnded = status === 'ENDED';

  const isCurrentUserAdmin = isAdmin();
  const PublicLinks =
    status === 'CLOSED' ? PastMeetingItemLinks : PendingMeetingItemLinks;
  const MeetingItemLinks = isCurrentUserAdmin
    ? AdminMeetingItemLinks
    : PublicLinks;

  return (
    <div
      className={classnames('MeetingListItem', { 'in-progress': isInProgress })}
    >
      <Link to={`meeting/${id}`} className="meeting-date">
        <h3>{date}</h3>
      </Link>
      <div
        className={classnames('meeting-status', {
          'progress-wrapper-started': isInProgress,
        })}
      >
        {isInProgress && (
          <>
            <StatusInProgress className="status-icon" />
            <span>{t('meeting.status.short.in-progress')}</span>
          </>
        )}
      </div>
      <Link to={`meeting/${id}`} className="meeting-time">
        <div>{time}</div>
      </Link>
      <MeetingItemLinks meeting={item} isInProgress={isInProgress} />
    </div>
  );
}

export default MeetingListItem;
