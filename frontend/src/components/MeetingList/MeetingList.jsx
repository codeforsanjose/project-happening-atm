import React from 'react';
import { Link } from 'react-router-dom';

// TODO: https://github.com/codeforsanjose/gov-agenda-notifier/issues/105

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
