import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import './AdminView.scss';

import AdminNavigation from './AdminNavigation/AdminNavigation';
import AdminHeader from './AdminHeader/AdminHeader';

const TEST_MEETING_IDS = [1, 2, 3];
const TEST_MEETINGS = {
  1: { id: 1, text: 'test one' },
  2: { id: 2, text: 'test two' },
  3: { id: 3, text: 'test three' },
};

/**
 * Main view component for Admin pages
 * On load it will fetch the meeting with the id retrieved from the URL parameter.
 *
 * props:
 *    headerText
 *      This is the h3 element that is displayed at the top of the view
 *    component
 *      This is the component rendered in the view
 *
 * state:
 *    meetingId
 *      Current selected meeting id from the dropdown selection box
 *    currentMeeting
 *      Meeting object that is passed to the current view
 *    meetingIdList
 *      An array of all meeting ids for the dropdown selection box
 */

function AdminView({ headerText, component: ComponentToRender }) {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const [meetingId, setMeetingId] = useState(id);
  const [currentMeeting, setCurrentMeeting] = useState({});
  const [meetingIdList, setMeetingIdList] = useState([]);

  /**
   * Fetch all meeting ids on load
   */
  useEffect(() => {
    async function getMeetingIds() {
      // TODO: https://github.com/codeforsanjose/gov-agenda-notifier/issues/85
      setTimeout(() => setMeetingIdList(TEST_MEETING_IDS), 1000); // MOCK API CALL
    }
    getMeetingIds();
  }, []);

  /**
   * Fetch meeting when meetingId is changed
   */
  useEffect(() => {
    const updatedPath = location.pathname.replace(/\w+$/, meetingId);
    history.replace(updatedPath);

    async function getMeeting() {
      // TODO: https://github.com/codeforsanjose/gov-agenda-notifier/issues/85
      setTimeout(() => setCurrentMeeting(TEST_MEETINGS[meetingId]), 2000); // MOCK API CALL
    }
    getMeeting();
  }, [meetingId, setMeetingId]);

  return (
    <div className="admin-view">
      <AdminNavigation meetingId={meetingId} />

      <div className="wrapper">
        <AdminHeader
          headerText={headerText}
          meetingIdList={meetingIdList}
          meetingId={meetingId}
          setMeetingId={setMeetingId}
        />
        <ComponentToRender meeting={currentMeeting} />
      </div>
    </div>
  );
}

export default AdminView
