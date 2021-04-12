import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { toDateString, toTimeString } from '../../utils/timestampHelper';
import './MeetingListItem.scss';

// Component imports
import {
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

  // Determine which set of item links to use based on meeting status
  const MeetingItemLinks = status === 'CLOSED' ? PastMeetingItemLinks : PendingMeetingItemLinks;
  // TODO: Implement admin links

  return (
    <div className={classnames('MeetingListItem', { 'in-progress': isInProgress })}>
      <Link to={`meeting/${id}`} className="meeting-date">
        <h3>
          {date}
          {isInProgress && ` - ${t('meeting.status.short.in-progress')}`}
        </h3>
      </Link>
      <Link to={`meeting/${id}`} className="meeting-time">
        <div>{time}</div>
      </Link>
      <MeetingItemLinks meetingId={id} isInProgress={isInProgress} />
    </div>
  );
}

export default MeetingListItem;
