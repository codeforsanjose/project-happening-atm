/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function ParticipateComment() {
  const { t } = useTranslation();

  return (
    <div className="ParticipateContent">
      <h3 className="ParticipateHeader">{t('meeting.tabs.participate.section.comment.title')}</h3>

      <p className="bold">{t('meeting.tabs.participate.section.comment.description.before-meeting.title')}</p>

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
            {t('meeting.tabs.participate.section.comment.description.before-meeting.number-1.subtitle')}
          </p>
        </li>
        <li>
          <p>{t('meeting.tabs.participate.section.comment.description.before-meeting.number-2.title')}</p>
          <p className="info">
            {t('meeting.tabs.participate.section.comment.description.before-meeting.number-2.subtitle')}
          </p>
          {/* TODO: Add link to eComment site for meeting
          https://github.com/codeforsanjose/gov-agenda-notifier/issues/104 */}
          <Link to="/">
            <button type="button">{t('meeting.tabs.participate.section.comment.description.before-meeting.number-2.button')}</button>
          </Link>
        </li>
      </ol>

      <p className="bold">{t('meeting.tabs.participate.section.comment.description.during-meeting.title')}</p>

      <ol>
        <li>
          <p>
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            Email
            {' '}
            <a href="mailto:councilmeeting@sanjoseca.gov">councilmeeting@sanjoseca.gov</a>
            {' '}
            during the meeting.
          </p>
          <p className="info">
            {t('meeting.tabs.participate.section.comment.description.during-meeting.number-1.subtitle')}
          </p>
        </li>
      </ol>
    </div>
  );
}

export default ParticipateComment;
