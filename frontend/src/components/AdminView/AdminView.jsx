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
    console.log('running loadMeetingIds') // DEBUG

    async function getMeetingIds() {
      setTimeout(() => setMeetingIdList(TEST_MEETING_IDS), 3000) // MOCK API CALL
    }
    getMeetingIds();
  }, []);

  /**
   * Fetch meeting when meetingId is changed
   */
  useEffect(function loadMeeting() {
    console.log('running loadMeeting') // DEBUG

    const updatedPath = location.pathname.replace(/\w+$/, meetingId);
    history.replace(updatedPath);

    async function getMeeting() {
      setTimeout(() => setCurrentMeeting(TEST_MEETINGS[meetingId]), 3000) // MOCK API CALL
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
          <ComponentToRender />
          <div>
            current id is: {meetingId}
          </div>

          {/* DEBUG */}
          <div style={{width: "600px", margin: "20px auto", backgroundColor: "#eee", color: "#361515", padding: "10px 20px", border: "1px solid #aaa"}}>
            <p>***** THE CURRENT currentMeeting IS *****</p>
            <div><pre>{JSON.stringify(currentMeeting, null, 2)}</pre></div>
          </div>
          {/* END DEBUG */}

        </div>
      </div>
  );
}

export default AdminView;
