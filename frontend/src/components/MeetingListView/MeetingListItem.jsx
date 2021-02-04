/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { toDateString, toTimeString } from '../../utils/timestampHelper';
import './MeetingListItem.scss';

import {
  PastMeetingItemLinks,
  PendingMeetingItemLinks,
} from './MeetingListItemLinks';

function MeetingListItem({ item }) {
  // eslint-disable-next-line camelcase
  const { id, meeting_start_timestamp, status } = item;
  const date = toDateString(meeting_start_timestamp);
  const time = toTimeString(meeting_start_timestamp);
  const isInProgress = status === 'IN PROGRESS';

  // Determine which set of controls to use for item based on meeting status
  const MeetingItemLinks = status === 'CLOSED' ? PastMeetingItemLinks : PendingMeetingItemLinks;

  return (
    <div className={classnames('MeetingListItem', { 'in-progress': isInProgress })}>
      <Link to={`meeting/${id}`}>
        <h3 className="meeting-date">
          {date}
          {isInProgress && ' - In Progress'}
        </h3>
      </Link>
      <div className="meeting-time">{time}</div>
      <MeetingItemLinks />
    </div>
  );
}

export default MeetingListItem;
