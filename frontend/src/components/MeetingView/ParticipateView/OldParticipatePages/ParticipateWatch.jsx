import React from 'react';
import { useTranslation } from 'react-i18next';

function ParticipateWatch() {
  const { t } = useTranslation();

  return (
    <div className="ParticipateContent">
      <h3 className="ParticipateHeader">{t('meeting.tabs.participate.section.watch.title')}</h3>

      <p>
        {t('meeting.tabs.participate.section.watch.description.preface')}
      </p>

      <p className="info">
        {t('meeting.tabs.paricipate.section.watch.description.closed-caption')}
      </p>

      <ol>
        <li>
          <p>{t('meeting.tabs.participate.section.watch.description.number-1.title')}</p>
        </li>
        <li>
          <p>{t('meeting.tabs.participate.section.watch.description.number-2.title')}</p>
          <a
            href="https://www.youtube.com/CityOfSanJoseCalifornia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button">{t('meeting.tabs.participate.section.watch.description.number-2.button')}</button>
          </a>
        </li>
        <li>
          <p>{t('meeting.tabs.participate.section.watch.description.number-3.title')}</p>
          <p className="info">
            {t('meeting.tabs.participate.section.watch.description.number-3.subtitle')}
          </p>
          <a
            href="https://www.sanjoseca.gov/news-stories/watch-a-meeting"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button">{t('meeting.tabs.participate.section.watch.description.number-3.button')}</button>
          </a>
        </li>
      </ol>
    </div>
  );
}

export default ParticipateWatch;
