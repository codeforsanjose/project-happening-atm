/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useTranslation } from 'react-i18next';

function ParticipateRequest() {
  const { t } = useTranslation();

  return (
    <div className="ParticipateContent">
      <h3 className="ParticipateHeader">
        {t('meeting.tabs.participate.section.consideration.title')}
      </h3>

      <p>
        {t('meeting.tabs.participate.section.consideration.description.preface')}
      </p>

      <ol>
        <li>
          <p>
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            Email
            {' '}
            <a href="mailto:city.clerk@sanjoseca.gov">city.clerk@sanjoseca.gov</a>
            {' '}
            by 10:00 a.m. the day of the meeting.
          </p>
          <p className="info">
            {t('meeting.tabs.participate.section.consideration.description.number-1.subtitle')}
          </p>
        </li>
      </ol>
    </div>
  );
}

export default ParticipateRequest;
