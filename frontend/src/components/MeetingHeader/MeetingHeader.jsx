import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import "./MeetingHeader.scss";
import classnames from "classnames";
import Spinner from "../Spinner/Spinner";
import MeetingStates from "../../constants/MeetingStates";
import Dropdown from "../Dropdown/Dropdown";

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


function MeetingHeader({
  loading, meeting, setSaveMeetingItems, progressStatus
}) {
  const { t } = useTranslation();

  const statuses = [
    { label: 'Upcoming', value: MeetingStates.UPCOMING },
    { label: 'In Progress', value: MeetingStates.IN_PROGRESS },
    { label: 'In Recess', value: MeetingStates.IN_RECESS },
    { label: 'Ended', value: MeetingStates.ENDED },
    { label: 'Deferred', value: MeetingStates.DEFERRED },
  ];
  
  //Set default status of meetings to Upcoming
  console.log('meeting.status:', meeting.status);
  const [meetingStatus, setMeetingStatus] = useState(statuses[0]); //MeetingStates.UPCOMING) //use this for css and then change the useState to be the meeting.status on reload
  const [updateMeeting, { updating, error }] = useMutation(UPDATE_MEETING);
  
  const handleSelectStatus = (option) => {
    setMeetingStatus(option);
  }


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

  // const Dropdown = ({ label, value, options, onChange }) => {
  //   return (
  //     <label>
  //       {label}
  //       <select value={value} onChange={onChange}>
  //         {options.map((option) => (
  //           <option key={option.label} value={option.value}>{option.label}</option>
  //         ))}
  //       </select>
  //     </label>
  //   );
  // };
  useEffect(() => {
    if(isAdmin() && meetingStatus.value !== MeetingStates.UPCOMING){
      updateMeeting({ 
        variables: { 
          ...meeting,
          status: meetingStatus.value, 
        }
      });
    }
    else if (meeting.status) {
      setMeetingStatus(meeting.status);
    }
  }, [meetingStatus, meeting.status]);

  // JYIP: 2023.07: if any meeting item becomes "In Progress" state, overall meeting becomes in progress state
  useEffect(() => {
    if(progressStatus){
      setMeetingStatus(statuses[1]); //MeetingStates.IN_PROGRESS);
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
          </div>
          <div className="details-title">Meeting Details</div>
          {loading && <Spinner />}
          {!loading && (
            <>
              <div className="date-wrapper">
                <div className="date">
                  {toDateString(meeting.meeting_start_timestamp, 'dddd, MMMM D, YYYY')}
                </div>
                <div className={(meetingStatus.value === MeetingStates.IN_PROGRESS) ? 'progress-wrapper progress-wrapper-started' : 'progress-wrapper'}>
                  {(meetingStatus.value === MeetingStates.UPCOMING) && <span>Upcoming</span>}
                  {(meetingStatus.value === MeetingStates.IN_PROGRESS) && <>
                    <span>In Progress</span> <StatusInProgress className="status-icon" />
                  </>}
                  {/* {(meetingStatus.value === MeetingStates.CANCELLED) && <span>Cancelled</span>} */}
                  {(meetingStatus.value === MeetingStates.ENDED) && <span>Ended</span>}
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
                      options={statuses}
                      value={meetingStatus}
                      onChange={handleSelectStatus}
                    />
                     {/* 
                     <Dropdown
                      label={`${t("meeting.status.label")}:`}
                      options={statuses}
                      value={meetingStatus}
                      onChange={handleMeetingStatusChange}
                       />
                       */}
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

export default MeetingHeader;
