import React from 'react';
import { Link } from 'react-router-dom';

function MeetingList() {
  return (
    <div className="MeetingList">
      <p>Placeholder for MeetingList</p>
      <Link to="/meeting/1">
        Temp link to Meeting View
      </Link>
    </div>
  );
}

export default MeetingList;
