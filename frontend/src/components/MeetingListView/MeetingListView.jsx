import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Accordion } from 'react-accessible-accordion';
import { groupMeetingsByDate } from '../../utils/timestampHelper';
import './MeetingListView.scss';

import { GET_ALL_MEETINGS } from '../../graphql/graphql';
import NavBarHeader from '../NavBarHeader/NavBarHeader';
import MeetingListGroup from './MeetingListGroup';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';

function MeetingListView() {
  const { loading, error, data } = useQuery(GET_ALL_MEETINGS);
  const [navToggled, setNavToggled] = useState(false);
  const [meetings, setMeetings] = useState([]);

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

  const meetingGroups = groupMeetingsByDate(meetings);

  return (
    <div className="MeetingListView">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      <div className="meeting-list-header">
        <img className="logo" src={cityLogo} alt="logo" />
        <h2>City Council Meetings</h2>
      </div>

      <div className="meeting-list-content">
        <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
          {meetingGroups.map((m) => <MeetingListGroup key={`${m.month}${m.year}`} month={m.month} year={m.year} meetings={m.meetings} />)}
        </Accordion>
      </div>
    </div>
  );
}

export default MeetingListView;
