import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipateView.scss';
import {
  Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel,
} from 'react-accessible-accordion';
import {
  VoiceChatIcon, OnDemandVideoIcon, EmailIcon, NewReleasesIcon,
} from '../../../utils/_icons';

function JoinTheVirtualMeetingPanel() {
  return (
    <>
      <ol>
        <li>
          {/* TODO: Add phone number, zoom meeting id, and link to join zoom meeting
          https://github.com/codeforsanjose/gov-agenda-notifier/issues/103 */}
          <p>Call ###-###-####</p>
          <p className="info">
            Enter Meeting ID ### #### ####
            Select *9 to &#34;Raise Hand&#34; to speak.
            Select *6 to unmute when your name is called.
          </p>
        </li>
        <li>
          <p>Join from your computer or smart device here*</p>
          <Link to="/">
            <button type="button">Join Zoom Meeting</button>
          </Link>
          <p className="info bold">*Zoom Web Browser Requirements</p>
          <p className="info">
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
function WatchMeetingBroadcastPanel() {
  return (
    <>
      <p>
        You have 3 options to watch the live meeting broadcast:
      </p>

      <p className="info">
        Closed Captioning is available for all
      </p>

      <ol>
        <li>
          <p>Comcast Cable Channel 26</p>
        </li>
        <li>
          <p>City&apos;s YouTube Channel</p>
          <a
            href="https://www.youtube.com/CityOfSanJoseCalifornia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button">Go to YouTube</button>
          </a>
        </li>
        <li>
          <p>City&apos;s Website</p>
          <p className="info">
            Find the meeting and click on &quot;In Progress&quot; or
            &quot;Currently in Session&quot; to watch.
          </p>
          <a
            href="https://www.sanjoseca.gov/news-stories/watch-a-meeting"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button">Go to the City&apos;s Website</button>
          </a>
        </li>
      </ol>
    </>
  );
}
function SubmitWrittenPublicCommentPanel() {
  return (
    <>
      <p className="bold">Before the Meeting</p>

      <ol>
        <li>
          <p>
            Email
            {' '}
            <a href="mailto:city.clerk@sanjoseca.gov">city.clerk@sanjoseca.gov</a>
            {' '}
            by 10:00 a.m. the day of the meeting.
          </p>
          <p className="info">
            Please identify the Agenda Item Number in the subject line of
            your email.
            Emails will be attached to the Council Item under &quot;Letters
            from the Public,&quot; but will not be read aloud during the
            meeting.
          </p>
        </li>
        <li>
          <p>Via eComment link</p>
          <p className="info">
            eComments are directly sent to Council and Committee staff.
          </p>
          {/* TODO: Add link to eComment site for meeting
    https://github.com/codeforsanjose/gov-agenda-notifier/issues/104 */}
          <Link to="/">
            <button type="button">Send eComment</button>
          </Link>
        </li>
      </ol>

      <p className="bold">During the Meeting</p>

      <ol>
        <li>
          <p>
            Email
            {' '}
            <a href="mailto:councilmeeting@sanjoseca.gov">councilmeeting@sanjoseca.gov</a>
            {' '}
            during the meeting.
          </p>
          <p className="info">
            Please identify the Agenda Item Number in the subject line of
            your email.
            Comments received will be included as a part of the meeting
            record but will not be read aloud during the meeting.
          </p>
        </li>
      </ol>
    </>
  );
}
function RequestSeparateConsiderationOfAConsentCalendarItemPanel() {
  return (
    <>
      <p>
        There will be no separate discussion of Consent Calendar items as
        they are considered to be routine by the City Council and will be
        adopted by one motion. If a member of the City Council, staff, or
        public requests discussion on a particular item, that item may be
        removed from the Consent Calendar and considered separately.
      </p>

      <p>
        If you wish to request separate discussion on a particular item
        of the consent calendar:
      </p>

      <ol>
        <li>
          <p>
            Email
            {' '}
            <a href="mailto:city.clerk@sanjoseca.gov">city.clerk@sanjoseca.gov</a>
            {' '}
            by 10:00 a.m. the day of the meeting.
          </p>
          <p className="info">
            Please identify the Consent Calendar Agenda Item Number in the
            subject line of your email.
          </p>
        </li>
      </ol>
    </>
  );
}
const CHOICES = [
  {
    id: 1,
    title: 'Join the Virtual Meeting',
    description: '',
    items: [],
    icon: <VoiceChatIcon />,
    panel: <JoinTheVirtualMeetingPanel />,
  },
  {
    id: 2,
    title: 'Watch Meeting Broadcast',
    description: '',
    items: [],
    icon: <OnDemandVideoIcon />,
    panel: <WatchMeetingBroadcastPanel />,
  },
  {
    id: 3,
    title: 'Submit Written Public Comment',
    description: '',
    items: [],
    icon: <EmailIcon />,
    panel: <SubmitWrittenPublicCommentPanel />,
  },
  {
    id: 4,
    title: 'Request Separate Consideration of a Consent Calendar Item',
    description: '',
    items: [],
    icon: <NewReleasesIcon />,
    panel: <RequestSeparateConsiderationOfAConsentCalendarItemPanel />,
  },
];

function ParticipateAccordion({ choice }) {
  return (
    <AccordionItem className="ParticipateView">
      <AccordionItemHeading className="group-header">
        <AccordionItemButton className="group-button" style={{ paddingBottom: '1.5em' }}>
          <div className="button-text" />
          <div className="group-title">
            {choice.title}
            {' '}
            {choice.icon}
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className="panel-animation">
        <div className="panel">{choice.panel}</div>
      </AccordionItemPanel>
    </AccordionItem>
  );
}

/**
 * Displays a list of links to the "Participate" pages.
 * Used in the MeetingView component.
 */

function ParticipateView() {
  return (
    <ul style={{ padding: '0 1.25em' }}>
      <Accordion
        allowZeroExpanded
        allowMultipleExpanded
      >
        {CHOICES.map((choice) => (
          <ParticipateAccordion key={choice.id} choice={choice} />
        ))}
      </Accordion>
    </ul>
  );
}

export default ParticipateView;
