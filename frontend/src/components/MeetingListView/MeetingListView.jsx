import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Accordion } from 'react-accessible-accordion';
import { groupMeetingsByDate, isFutureTimestamp } from '../../utils/timestampHelper';
import './MeetingListView.scss';

import { GET_ALL_MEETINGS } from '../../graphql/graphql';
import NavBarHeader from '../NavBarHeader/NavBarHeader';
import MeetingListGroup from './MeetingListGroup';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';
import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../utils/_icons';

function MeetingListView() {
  const { loading, error, data } = useQuery(GET_ALL_MEETINGS);
  const [navToggled, setNavToggled] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [showPastMeetings, setShowPastMeetings] = useState(false);

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  useEffect(() => {
    if (data) {
      setMeetings(data.getAllMeetings);
    }
  }, [data]);

  // TODO: Create loading and error states
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const meetingsToDisplay = showPastMeetings
    ? meetings
    : meetings.filter((m) => m.status === 'IN PROGRESS' || isFutureTimestamp(m.meeting_start_timestamp));
  const meetingGroups = groupMeetingsByDate(meetingsToDisplay);

  return (
    <div className="MeetingListView">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      <div className="meeting-list-header">
        <img className="logo" src={cityLogo} alt="logo" />
        <p className="sub-header">My City&apos;s Agenda</p>
        <h2>City Council Meetings</h2>
      </div>

      <div className="meeting-list-content">
        <button
          type="button"
          className="complete-toggle"
          onClick={() => setShowPastMeetings((completed) => !completed)}
        >
          {showPastMeetings ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
          <p>Show Past Meetings</p>
        </button>

        {
          meetingGroups.length > 0
            ? (
              <Accordion allowZeroExpanded allowMultipleExpanded>
                {meetingGroups.map((m) => <MeetingListGroup key={`${m.month}${m.year}`} month={m.month} year={m.year} meetings={m.meetings} />)}
              </Accordion>
            ) : (
              <div>No meetings found!</div>
            )
        }
      </div>
    </div>
  );
}

export default MeetingListView;
