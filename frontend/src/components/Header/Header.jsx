import React from 'react';
import { useTranslation } from 'react-i18next';
import './Header.scss';
import classnames from 'classnames';
import { unixTimeStringToDateString, unixTimeStringToTimeString, getRelativeTimeLocKey } from '../../utils/timestampHelper';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';

function Header({ meeting }) {
  const { t } = useTranslation();

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

          <div className="date">
            {unixTimeStringToDateString(meeting.meeting_start_timestamp, 'dddd, MMMM D, YYYY')}
          </div>

          <div className="time">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            {t('meeting.start-time')}:
            {' '}
            <span className="no-bold">{unixTimeStringToTimeString(meeting.meeting_start_timestamp)}</span>
          </div>

          <div className="status">
            {t(getRelativeTimeLocKey(meeting.meeting_start_timestamp))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
