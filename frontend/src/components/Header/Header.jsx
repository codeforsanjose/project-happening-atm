import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import "./Header.scss";
import classnames from "classnames";
import Spinner from "../Spinner/Spinner";
import MeetingStates from "../../constants/MeetingStates";

import {
  toDateString,
  toTimeString,
  isFutureTimestamp,
  getDifference,
} from "../../utils/timestampHelper";

import { useMutation } from '@apollo/client';
import { UPDATE_MEETING } from "../../graphql/mutation";

// Asset imports
import cityLogo from "../../assets/SanJoseCityLogo.png";
import {
  StatusInProgress,
} from '../../utils/_icons';

// functions used by this component
import isAdmin from "../../utils/isAdmin";

const MEETING_RELATIVE_TIME_LOC_KEY_PREFIX = "meeting.status.relative.long.";
const PAST_MEETING_STATUS_LOC_KEY = "meeting.status.long.ended";


function Header({
  loading, meeting, setSaveMeetingItems, progressStatus
}) {
  const { t } = useTranslation();

  //set default status of meetings to not started
  const [meetingStatus, setMeetingStatus] = useState(MeetingStates.NOT_STARTED) //use this for css and then change the useState to be the meeting.status on reload
  const [updateMeeting, { updating, error }] = useMutation(UPDATE_MEETING);
  
  const statuses = [
    { label: 'Not Started', value: MeetingStates.NOT_STARTED },
    { label: 'In Progress', value: MeetingStates.IN_PROGRESS },
    { label: 'Ended', value: MeetingStates.ENDED },
    { label: 'Cancelled', value: MeetingStates.CANCELLED },
  ];

  const getRelativeTimeLocKey = () => {
    // Returns a locale key for a meeting status (relative to the current time).
    if (isFutureTimestamp(meeting.meeting_start_timestamp)) {
      const diffInDays = getDifference(meeting.meeting_start_timestamp);
      if (diffInDays > 6) {
        return `${MEETING_RELATIVE_TIME_LOC_KEY_PREFIX}in-1-week`;
      }
      return `${MEETING_RELATIVE_TIME_LOC_KEY_PREFIX}in-${diffInDays}-day${
        diffInDays <= 1 ? "" : "s"
      }`;
    }
    return PAST_MEETING_STATUS_LOC_KEY;
  };

  const Dropdown = ({ label, value, options, onChange }) => {
    return (
      <label>
        {label}
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  };

  useEffect(() => {
    if(isAdmin() && meetingStatus !== MeetingStates.NOT_STARTED){
      updateMeeting({ 
        variables: { 
          ...meeting,
          id: meeting.id,
          status: meetingStatus, 
        }
      });
    }
    else if (meeting.status) {
      setMeetingStatus(meeting.status);
    }
  }, [meetingStatus, meeting.status]);

  useEffect(() => {
    if(progressStatus){
      setMeetingStatus(MeetingStates.IN_PROGRESS);
    } 

  }, [progressStatus])

  const handleMeetingStatusChange = (event) => {
    event.preventDefault();
    setMeetingStatus(event.target.value);

  };
  
  return (
    <div className={classnames("header")}>
      <div className={classnames("header-content")}>
        <img className="logo" src={cityLogo} alt="logo" />
        <div className="meeting-info">
          <div className="title">
            {t('header.city-council-meeting-agenda')}
            {(meetingStatus === MeetingStates.IN_PROGRESS) && <span className="statusInProgress"><StatusInProgress /></span>}
          </div>
          <div className="details-title">Meeting Details</div>

          {loading && <Spinner />}

          {!loading && (
            <>
              <div className="date-wrapper">
                <div className="date">
                  {toDateString(meeting.meeting_start_timestamp, 'dddd, MMMM D, YYYY')}
                </div>
                <div className={(meetingStatus === MeetingStates.IN_PROGRESS) ? 'progress-wrapper progress-wrapper-started' : 'progress-wrapper'}>
                  {(meetingStatus === MeetingStates.NOT_STARTED) && <span>Not Started</span>}
                  {(meetingStatus === MeetingStates.IN_PROGRESS) && <>
                    <span>In Progress</span> <StatusInProgress className="status-icon" />
                  </>}
                  {(meetingStatus === MeetingStates.CANCELLED) && <span>Cancelled</span>}
                  {(meetingStatus === MeetingStates.ENDED) && <span>Ended</span>}
                </div>
              </div>
              <div className="time">
                {t("meeting.start-time")}:{" "}
                <span className="no-bold">
                  {toTimeString(meeting.meeting_start_timestamp)}
                </span>
              </div>

              <div className="status">{t(getRelativeTimeLocKey())}</div>

              {isAdmin() && (
                <>
                  <div className="saveStatus">
                    <Dropdown
                      label={`${t("meeting.status.label")}:`}
                      options={statuses}
                      value={meetingStatus}
                      onChange={handleMeetingStatusChange}
                    />
                  </div>
              
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
