import React from 'react';
import './AdminHeader.scss';

/**
 * Header component that is displayed on each Admin page
 *
 * props:
 *    headerText
 *      Text for the h3 element
 *    meetingIdList
 *      An array of meeting ids for the select dropdown box
 *    meetingId
 *      The currently selected meeting id
 *    setMeetingId
 *      State setter from AdminView
 */

export default function AdminHeader({ headerText, meetingIdList, meetingId, setMeetingId }) {
  const handleSelect = (e) => {
    setMeetingId(e.target.value);
  }

  return (
    <div className="AdminHeader">
      <div className="top-nav">
        <label>
          Meeting:
          <select value={meetingId} onChange={handleSelect}>
            {
              meetingIdList.map(id => <option key={id} value={id}>{id}</option>)
            }
          </select>
        </label>
        <button>Sign Out</button>
      </div>

      <div className="header-text">
        <h3>{headerText}</h3>
      </div>
    </div>
  )
}