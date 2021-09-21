import React from 'react';
import { useTranslation } from 'react-i18next';
import './ParticipateView.scss';
import {
  Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel,
} from 'react-accessible-accordion';
import {
  VoiceChatIcon, OnDemandVideoIcon, EmailIcon, NewReleasesIcon,
} from '../../../utils/_icons';

function JoinTheVirtualMeetingPanel({ meeting }) {
  const { t } = useTranslation();

  return (
    <>
      <ol>
        <li>
          {/* TODO #127: Figure out how we're going to translate interactive texts */}
          <p>Call {meeting.call_in_information}</p>
          <p className="info">
            Enter Meeting ID {meeting.virtual_meeting_id}<br/>
            Select *9 to &#34;Raise Hand&#34; to speak.
            Select *6 to unmute when your name is called.
          </p>
        </li>
        <li>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <p>{t('meeting.tabs.participate.section.join.description.number-2.title')}*</p>
          <a href={meeting.virtual_meeting_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button">{t('meeting.tabs.participate.section.join.description.number-2.button')}</button>
          </a>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <p className="info bold">*{t('meeting.tabs.participate.section.join.description.post-script.title')}</p>
          <p className="info">
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            Must have the application installed. Use a current,
            up-to-date browser: Chrome 30+, Firefox 27+,
            Microsoft Edge 12+, Safari 7+. Certain functionality
            may be disabled in older browsers including Internet
            Explorer. Learn more at
            {' '}
            <a
              href="https://zoom.us/"
              target="_blank"
              rel="noopener noreferrer"
            >
              zoom.us
            </a>
            .
          </p>

          <p className="info">
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            For more information on how to join a meeting,
            {' '}
            <a
              href="https://support.zoom.us/hc/en-us/articles/201362193-Joining-a-meeting"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here
            </a>
            .
          </p>
        </li>
      </ol>
    </>
  );
}
function WatchMeetingBroadcastPanel({ meeting }) {
  const { t } = useTranslation();

  return (
    <>
      <p>
        {t('meeting.tabs.participate.section.watch.description.preface')}
      </p>

      <p className="info">
        {t('meeting.tabs.participate.section.watch.description.closed-caption')}
      </p>

      <ol>
        <li>
          <p>{t('meeting.tabs.participate.section.watch.description.number-1.title')}</p>
        </li>
        <li>
          <p>{t('meeting.tabs.participate.section.watch.description.number-2.title')}</p>
          <a
            href={meeting.youtube_link}
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
    </>
  );
}
function SubmitWrittenPublicCommentPanel({ meeting }) {
  const { t } = useTranslation();

  return (
    <>
      <p className="bold">{t('meeting.tabs.participate.section.comment.description.before-meeting.title')}</p>

      <ol>
        <li>
          <p>
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            Email
            {' '}
            <a href={`mailto:${meeting.email_before_meeting}`}>
              {meeting.email_before_meeting}
            </a>
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
          <a href={meeting.ecomment}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button">{t('meeting.tabs.participate.section.comment.description.before-meeting.number-2.button')}</button>
          </a>
        </li>
      </ol>

      <p className="bold">{t('meeting.tabs.participate.section.comment.description.during-meeting.title')}</p>

      <ol>
        <li>
          <p>
            {/* TODO #127: Figure out how we're going to translate interactive texts */}
            Email
            {' '}
            <a href={`mailto:${meeting.email_during_meeting}`}>
              {meeting.email_during_meeting}
            </a>
            {' '}
            during the meeting.
          </p>
          <p className="info">
            {t('meeting.tabs.participate.section.comment.description.during-meeting.number-1.subtitle')}
          </p>
        </li>
      </ol>
    </>
  );
}
function RequestSeparateConsiderationOfAConsentCalendarItemPanel() {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
}
const CHOICES = [
  {
    id: 1,
    title: 'meeting.tabs.participate.section.join.title',
    description: '',
    items: [],
    icon: <VoiceChatIcon />,
    panel: JoinTheVirtualMeetingPanel,
  },
  {
    id: 2,
    title: 'meeting.tabs.participate.section.watch.title',
    description: '',
    items: [],
    icon: <OnDemandVideoIcon />,
    panel: WatchMeetingBroadcastPanel,
  },
  {
    id: 3,
    title: 'meeting.tabs.participate.section.comment.title',
    description: '',
    items: [],
    icon: <EmailIcon />,
    panel: SubmitWrittenPublicCommentPanel,
  },
  {
    id: 4,
    title: 'meeting.tabs.participate.section.consideration.title',
    description: '',
    items: [],
    icon: <NewReleasesIcon />,
    panel: RequestSeparateConsiderationOfAConsentCalendarItemPanel,
  },
];

function ParticipateAccordion({ choice, meeting }) {
  const { t } = useTranslation();

  return (
    <AccordionItem className="ParticipateView">
      <AccordionItemHeading className="group-header">
        <AccordionItemButton className="group-button" style={{ paddingBottom: '1.5em' }}>
          <div className="button-text" />
          <div className="group-title">
            {t(choice.title)}
            {' '}
            {choice.icon}
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className="panel-animation">
        <div className="panel">
          {React.createElement(choice.panel, { meeting })}
        </div>
      </AccordionItemPanel>
    </AccordionItem>
  );
}

/**
 * Displays a list of links to the "Participate" pages.
 * Used in the MeetingView component.
 */

function ParticipateView({ meeting }) {
  return (
    <ul style={{ padding: '0 1.25em' }}>
      <Accordion
        allowZeroExpanded
        allowMultipleExpanded
      >
        {CHOICES.map((choice) => (
          <ParticipateAccordion
            key={choice.id}
            choice={choice}
            meeting={meeting}
          />
        ))}
      </Accordion>
    </ul>
  );
}

export default ParticipateView;
