import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Accordion } from 'react-accessible-accordion';
import {
  groupMeetingsByDate,
  isFutureTimestamp,
} from '../../utils/timestampHelper';
import {
  GET_ALL_MEETINGS,
  GET_ALL_UPCOMING_MEETINGS,
} from '../../graphql/query';

import isAdmin from '../../utils/isAdmin';
import './MeetingListView.scss';

// Component imports
import NavBarHeader from '../NavBarHeader/NavBarHeader';
import { AdminMeetingListViewLinks } from './MeetingListViewLinks';
import MeetingListGroup from './MeetingListGroup';
import Spinner from '../Spinner/Spinner';
import PollIntervals from '../../constants/PollStatusIntervals';
// Asset imports
import MEETINGS_ARCHIVE_URL from '../../constants/MeetingsArchiveURL';
import cityLogo from '../../assets/SanJoseCityLogo.png';
import {
  CheckedCheckboxIcon,
  UncheckedCheckboxIcon,
  ExternalSite,
} from '../../utils/_icons';

/**
 * Main view component to display a list of upcoming/past meetings.
 *
 * state:
 *    navToggled
 *      Boolean value indicating if the header nav component is open
 *    meetings
 *      Array of all meetings returned from the getAllMeetings query
 *    showPastMeetings
 *      Boolean state toggle indicating if past meetings are shown
 */

function MeetingListView() {
  const { t } = useTranslation();

  const { loading, error, data, refetch } = useQuery(GET_ALL_UPCOMING_MEETINGS);

  const [navToggled, setNavToggled] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [showPastMeetings, setShowPastMeetings] = useState(false);
  const isCurrentUserAdmin = isAdmin();

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  useEffect(() => {
    if (data) {
      setMeetings(data.getAllUpcomingMeetings);
    }
    // poll for any meeting or agenda item status changes by other (admin) users
    const timer = window.setInterval(() => {
      refetch();
    }, PollIntervals.HALF_MINUTE_IN_MILLISECONDS);
    // clear interval polling timer when unmounting (e.g. user leaves page)
    return () => {
      clearInterval(timer);
    };
  }, [data]);

  const meetingsToDisplay = showPastMeetings
    ? meetings
    : meetings?.filter(
        (m) =>
          m.status === 'IN PROGRESS' ||
          isFutureTimestamp(m.meeting_start_timestamp)
      );
  const meetingGroups = groupMeetingsByDate(meetingsToDisplay);

  return (
    <div className="MeetingListView">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      <div className="meeting-list-header">
        <h2>{t('header.city-council-meetings')}</h2>
        {isCurrentUserAdmin ? <AdminMeetingListViewLinks /> : null}
      </div>

      <div className="meeting-list-content">
        {!(loading || error) &&
          (meetingGroups.length > 0 ? (
            <Accordion
              allowZeroExpanded
              allowMultipleExpanded
              preExpanded={[0]}
            >
              {meetingGroups.map((m, i) => (
                <MeetingListGroup
                  uuid={i}
                  key={`${m.month}${m.year}`}
                  month={m.month}
                  year={m.year}
                  meetings={m.meetings}
                />
              ))}
            </Accordion>
          ) : (
            <div>{t('meeting.list.no-meeting')}</div>
          ))}

        {loading && (
          <div className="loader">
            <Spinner />
          </div>
        )}
        {error && <div className="loader">{`Error! ${error.message}`}</div>}
        <div className="past-meetings">
          <p>{t('meeting.list.look-for-past')}</p>
          <a
            href={MEETINGS_ARCHIVE_URL.LINK}
            target="_blank" // open link in new tab
            rel="noopener noreferrer"
          >
            <p>
              Search the archive <ExternalSite className="translate-down" />
            </p>
          </a>
        </div>
        {/* <button
          type="button"
          className="complete-toggle"
          onClick={() => setShowPastMeetings((completed) => !completed)}
        >
          {showPastMeetings ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
          <p>{t('meeting.list.show-past')}</p>
        </button> */}
      </div>
    </div>
  );
}

export default MeetingListView;
