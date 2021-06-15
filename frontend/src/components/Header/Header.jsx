import React from 'react';
import { useTranslation } from 'react-i18next';
import './Header.scss';
import classnames from 'classnames';
import Spinner from '../Spinner/Spinner';
import {
  toDateString,
  toTimeString,
  isFutureTimestamp,
  getDifference,
} from '../../utils/timestampHelper';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';

const MEETING_RELATIVE_TIME_LOC_KEY_PREFIX = 'meeting.status.relative.long.';
const PAST_MEETING_STATUS_LOC_KEY = 'meeting.status.long.ended';

function Header({ loading, meeting, setSaveMeetingItems }) {
  const { t } = useTranslation();

  const getRelativeTimeLocKey = () => {
    // Returns a locale key for a meeting status (relative to the current time).
    if (isFutureTimestamp(meeting.meeting_start_timestamp)) {
      const diffInDays = getDifference(meeting.meeting_start_timestamp);
      if (diffInDays > 6) {
        return `${MEETING_RELATIVE_TIME_LOC_KEY_PREFIX}in-1-week`;
      }
      return `${MEETING_RELATIVE_TIME_LOC_KEY_PREFIX}in-${diffInDays}-day${diffInDays <= 1 ? '' : 's'}`;
    }
    return PAST_MEETING_STATUS_LOC_KEY;
  };

  return (
    <div className={classnames('header')}>
      <div className={classnames('header-content')}>
        <img className="logo" src={cityLogo} alt="logo" />
        <div className="meeting-info">
          <div className="title">
            {t('header.city-council-meeting-agenda')}
          </div>

          <div className="details-title">
            Meeting Details
          </div>

          {loading && <Spinner />}

          {!loading && (
            <>
              <div className="date">
                {toDateString(meeting.meeting_start_timestamp, 'dddd, MMMM D, YYYY')}
              </div>

              <div className="time">
                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                {t('meeting.start-time')}:
                {' '}
                <span className="no-bold">{toTimeString(meeting.meeting_start_timestamp)}</span>
              </div>

              <div className="status">
                {t(getRelativeTimeLocKey())}
              </div>

              <div className="saveStatus">
                Meeting Status:
                <button type="button" onClick={() => { setSaveMeetingItems(true); }}>Update Status</button>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
