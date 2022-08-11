import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { toDateString, toTimeString } from '../../utils/timestampHelper';
import './MeetingListItem.scss';
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
  const date = toDateString(meeting_start_timestamp);
  const time = toTimeString(meeting_start_timestamp);
  const isInProgress = status === 'IN PROGRESS';

  const isCurrentUserAdmin = isAdmin();
  const PublicLinks = status === 'CLOSED' ? PastMeetingItemLinks : PendingMeetingItemLinks;
  const MeetingItemLinks = isCurrentUserAdmin ? AdminMeetingItemLinks : PublicLinks;

  return (
    <div className={classnames('MeetingListItem', { 'in-progress': isInProgress })}>
      <Link to={`meeting/${id}`} className="meeting-date">
        <h4>
          {date}<br></br>
          {time}
        </h4>
      </Link>
      <Link to={`meeting/${id}`} className="meeting-time">
          {isInProgress && ` - ${t('meeting.status.short.in-progress')}`}
      </Link>
      <MeetingItemLinks meeting={item} isInProgress={isInProgress} />
    </div>
  );
}

export default MeetingListItem;
