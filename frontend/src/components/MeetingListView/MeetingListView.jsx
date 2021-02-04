import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion } from 'react-accessible-accordion';
import { groupMeetingsByDate } from '../../utils/timestampHelper';
import './MeetingListView.scss';

import NavBarHeader from '../NavBarHeader/NavBarHeader';
import MeetingListGroup from './MeetingListGroup';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';

const test = [
  {
    id: 1,
    meeting_start_timestamp: '1611820800000000',
    status: 'PENDING',
  },
  {
    id: 2,
    meeting_start_timestamp: '1640457000000000',
    status: 'PENDING',
  },
  {
    id: 3,
    meeting_start_timestamp: '1637865000000000',
    status: 'PENDING',
  },
  {
    id: 4,
    meeting_start_timestamp: '1638297000000000',
    status: 'PENDING',
  },
  {
    id: 5,
    meeting_start_timestamp: '1637433000000000',
    status: 'PENDING',
  },
  {
    id: 6,
    meeting_start_timestamp: '1614277800000000',
    status: 'PENDING',
  },
  {
    id: 7,
    meeting_start_timestamp: '1614105000000000',
    status: 'PENDING',
  },
  {
    id: 8,
    meeting_start_timestamp: '1613154600000000',
    status: 'PENDING',
  },
  {
    id: 9,
    meeting_start_timestamp: '1612204200000000',
    status: 'PENDING',
  },
  {
    id: 10,
    meeting_start_timestamp: '1612218600000000',
    status: 'PENDING',
  },
  {
    id: 11,
    meeting_start_timestamp: '1612229400000000',
    status: 'PENDING',
  },
  {
    id: 12,
    meeting_start_timestamp: '1612287000000000',
    status: 'PENDING',
  },
  {
    id: 13,
    meeting_start_timestamp: '1614706200000000',
    status: 'PENDING',
  },
  {
    id: 14,
    meeting_start_timestamp: '1614879000000000',
    status: 'PENDING',
  },
  {
    id: 15,
    meeting_start_timestamp: '1617553800000000',
    status: 'PENDING',
  },
  {
    id: 16,
    meeting_start_timestamp: '1641317400000000',
    status: 'PENDING',
  },
];

function MeetingListView() {
  const [navToggled, setNavToggled] = useState(false);

  const meetingGroups = groupMeetingsByDate(test);

  function handleToggle() {
    setNavToggled(!navToggled);
  }

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
