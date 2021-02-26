import React from 'react';
import { useTranslation } from 'react-i18next';
import './Header.scss';
import classnames from 'classnames';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';

function Header({ shouldHide }) {
  const { t } = useTranslation();

  return (
    <div className={classnames('header', {
      hide: shouldHide,
    })}
    >
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
            Tuesday, August 25, 2020
          </div>

          <div className="time">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            {t('meeting.start-time')}:
            {' '}
            <span className="no-bold">11:00 AM</span>
          </div>

          <div className="status">
            {t('meeting.status.relative.long.in-progress')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
