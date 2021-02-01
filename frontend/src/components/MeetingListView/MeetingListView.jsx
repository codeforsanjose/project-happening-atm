import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion } from 'react-accessible-accordion';
import './MeetingListView.scss';

import NavBarHeader from '../NavBarHeader/NavBarHeader';
import MeetingListGroup from './MeetingListGroup';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';

const TEST_MEETINGS = [
  {
    id: 1,
    startTime: new Date('2020-12-25 10:30'),
    status: 'In Progress',
  },
];

function MeetingListView() {
  const [navToggled, setNavToggled] = useState(false);

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
          <MeetingListGroup
            month="Test"
            year="2020"
            meetings={TEST_MEETINGS}
          />
        </Accordion>
      </div>
    </div>
  );
}

export default MeetingListView;
