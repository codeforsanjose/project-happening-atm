import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import './AdminView.scss';

import AdminNavigation from './AdminNavigation/AdminNavigation'
import AdminHeader from './AdminHeader/AdminHeader';

const TEST_MEETING_IDS = [1,2,3];
const TEST_MEETINGS = {
  1: {id:1,text:'test one'},
  2: {id:2,text:'test two'},
  3: {id:3,text:'test three'},
};

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
  useEffect(function loadMeetingIds() {
    async function getMeetingIds() {
      setTimeout(() => setMeetingIdList(TEST_MEETING_IDS), 1000) // MOCK API CALL
    }
    getMeetingIds();
  }, []);

  /**
   * Fetch meeting when meetingId is changed
   */
  useEffect(function loadMeeting() {
    const updatedPath = location.pathname.replace(/\w+$/, meetingId);
    history.replace(updatedPath);

    async function getMeeting() {
      setTimeout(() => setCurrentMeeting(TEST_MEETINGS[meetingId]), 2000) // MOCK API CALL
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

export default AdminView;
