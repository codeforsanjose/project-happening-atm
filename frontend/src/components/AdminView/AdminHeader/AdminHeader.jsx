import React from 'react';
import './AdminHeader.scss';

export default function AdminHeader({ headerText, meetingIdList, meetingId, setMeetingId }) {
  const handleSelect = (e) => {
    setMeetingId(e.target.value);
  }

  return (
    <div className="AdminHeader">
      <div className="top-nav">
        <select value={meetingId} onChange={handleSelect}>
          {
            meetingIdList.map(id => <option key={id} value={id}>{id}</option>)
          }
        </select>
        <button>Sign Out</button>
      </div>

      <div className="header-text">
        <h3>{headerText}</h3>
      </div>
    </div>
  )
}