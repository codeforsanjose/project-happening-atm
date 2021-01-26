import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MeetingListView.scss';

import NavBarHeader from '../NavBarHeader/NavBarHeader';

// Asset imports
import cityLogo from '../../assets/SanJoseCityLogo.png';

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
        <Link to="/meeting/1">
          Temp link to Meeting View
        </Link>
      </div>
    </div>
  );
}

export default MeetingListView;
