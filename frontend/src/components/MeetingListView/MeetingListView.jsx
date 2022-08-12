import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Accordion } from 'react-accessible-accordion';
import { groupMeetingsByDate, isFutureTimestamp } from '../../utils/timestampHelper';
import { GET_ALL_MEETINGS, LOGIN_GOOGLE } from '../../graphql/graphql';
import isAdmin from '../../utils/isAdmin';
import './MeetingListView.scss';

// Component imports
import NavBarHeader from '../NavBarHeader/NavBarHeader';
import { AdminMeetingListViewLinks } from './MeetingListViewLinks';
import MeetingListGroup from './MeetingListGroup';
import Spinner from '../Spinner/Spinner';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';
import { CalendarBlueIcon, CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../utils/_icons';

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

  const { loading, error, data } = useQuery(GET_ALL_MEETINGS);
  const [navToggled, setNavToggled] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [showPastMeetings, setShowPastMeetings] = useState(false);
  const isCurrentUserAdmin = isAdmin();

  function handleToggle() {
    setNavToggled(!navToggled);
  }
  
  useEffect(() => {
    if (data) {
      setMeetings(data.getAllMeetings);
    }
  }, [data]);

  const meetingsToDisplay = showPastMeetings
    ? meetings
    : meetings.filter((m) => m.status === 'IN PROGRESS' || isFutureTimestamp(m.meeting_start_timestamp));
  const meetingGroups = groupMeetingsByDate(meetingsToDisplay);

  return (
    <div className="MeetingListView">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      <div className="meeting-list-header">
        {/* <p className="sub-header">{t('header.my-city-agenda')}</p> */}
        <div className="sub-header">
          <p><CalendarBlueIcon height="16px"/>{t('header.calendar')}</p>
          { isCurrentUserAdmin ? <AdminMeetingListViewLinks /> : null }
        </div>
        <h2>{t('header.city-council-meetings')}</h2>
      </div>

      <div className="meeting-list-content">
        {/*/// MVP version does not display past meetings ///
        
        <button
          type="button"
          className="complete-toggle"
          onClick={() => setShowPastMeetings((completed) => !completed)}
        >
          {showPastMeetings ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
          <p>{t('meeting.list.show-past')}</p>
        </button> */}

        {
            !(loading || error) && (meetingGroups.length > 0
              ? (
                <Accordion allowZeroExpanded allowMultipleExpanded preExpanded={[0]}>
                  {meetingGroups.map((m, i) => <MeetingListGroup uuid={i} key={`${m.month}${m.year}`} month={m.month} year={m.year} meetings={m.meetings} />)}
                </Accordion>
              ) : (
                <div>{t('meeting.list.no-meeting')}</div>
              ))
          }

        {loading && <div className="loader"><Spinner /></div>}
        {error && <div className="loader">{`Error! ${error.message}`}</div>}
          <div className='footerSearchLink'>Looking for past meetings?<br></br>
            <a href="google.com">Search the archive</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
              <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
            </svg>
          </div>
      </div>
    </div>
  );
}

export default MeetingListView;
