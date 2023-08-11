import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./MeetingHeader.scss";
import Spinner from "../Spinner/Spinner";
import MeetingStates from "../../constants/MeetingStates";
import Dropdown from "../Dropdown/Dropdown";
import classNames from "classnames";

import { toDateString, toTimeString } from "../../utils/timestampHelper";

import { useMutation } from "@apollo/client";
import { UPDATE_MEETING } from "../../graphql/mutation";

// Asset imports
import { StatusInProgress } from "../../utils/_icons";

// functions used by this component
import isAdmin from "../../utils/isAdmin";

function MeetingHeader({
  loading,
  meeting,
  setSaveMeetingItems,
  progressStatus,
}) {
  const { t } = useTranslation();

  // possible meeting statuses to be passed into dropdown w/ internationalization of status labels
  const statuses = [
    {
      label: t("meeting.status.short.upcoming"),
      value: MeetingStates.UPCOMING,
    },
    {
      label: t("meeting.status.short.in-progress"),
      value: MeetingStates.IN_PROGRESS,
    },
    {
      label: t("meeting.status.short.in-recess"),
      value: MeetingStates.IN_RECESS,
    },
    { label: t("meeting.status.short.ended"), value: MeetingStates.ENDED },
    {
      label: t("meeting.status.short.deferred"),
      value: MeetingStates.DEFERRED,
    },
  ];

  // index map of different meeting statuses
  const statusIndexMap = statuses.map((status) => status.value);

  // internationalization (i.e. "i18") of days of week for meeting day/time display
  const i18Date = () => {
    const dayArrayIndex = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dateString = toDateString(
      meeting.meeting_start_timestamp,
      "dddd D"
    ).split(" ");
    const dayOfWeek = dateString[0];
    const i18DayIndex = dayArrayIndex.indexOf(dayOfWeek);
    return (
      t("standard.weekdays", { returnObjects: true })[i18DayIndex] +
      " " +
      dateString[1]
    );
  };

  // define state for selected meeting status and the graphql mutation for updating meeting in DB
  const [meetingStatus, setMeetingStatus] = useState(
    statuses[statusIndexMap.indexOf("UPCOMING")]
  ); //Set default status of meetings to Upcoming
  const [updateMeeting, { updating, error }] = useMutation(UPDATE_MEETING);

  // re-render whenever meeting status changes
  useEffect(() => {
    if (isAdmin() && meetingStatus.value !== MeetingStates.UPCOMING) {
      updateMeeting({
        variables: {
          ...meeting,
          status: meetingStatus.value,
        },
      });
    } else if (meetingStatus.value !== meeting.status && meeting.status) {
      setMeetingStatus(statuses[statusIndexMap.indexOf(meeting.status)]);
    }
  }, [meetingStatus, meeting.status]);

  // JYIP: 2023.07 observation of inherited functionality (i.e. someone else built this) & potential issue:
  // FUNCTIONALITY: If any meeting item is changed to "In Progress" status, overall meeting status automatically
  // changes to "In Progress" status
  // ISSUE: admin cannot subsequently change overall meeting status from "In Progress" to something else,
  // unless all individual meeting item statuses are changed to something other than "in Progress",
  useEffect(() => {
    if (progressStatus) {
      setMeetingStatus(statuses[statusIndexMap.indexOf("IN PROGRESS")]);
    }
  }, [progressStatus]);

  // handle new user selection for meeting status
  const handleSelectStatus = (option) => {
    setMeetingStatus(option);
  };

  // flag to indicate if meeting is in progress
  const isInProgress = meetingStatus.value === "IN PROGRESS";

  return (
    <div className="meeting-header">
      {!loading && (
        <>
          {isAdmin() && (
            <div
              className={classNames(
                meetingStatus.value.toLowerCase().split(" ").join("-"),
                "selector-panel"
              )}
            >
              <label htmlFor="meeting-status-dropdown" className="label">
                {t("meeting.status.label")}
              </label>
              <div id="meeting-status-dropdown">
                <Dropdown
                  id="meeting-status-dropdown"
                  options={statuses}
                  value={meetingStatus}
                  onChange={handleSelectStatus}
                  dropDownType={"meeting-status"}
                />
              </div>
            </div>
          )}
        </>
      )}
      <div
        className={classNames(
          "header-shared-content",
          isAdmin() && "header-shared-content--admin"
        )}
      >
        <div className="meeting-info">
          {loading && <Spinner />}
          <div className="meeting-info-panel">
            {!loading && (
              <div className="date-status-wrapper">
                <div className="date">
                  {i18Date() +
                    ", " +
                    toTimeString(meeting.meeting_start_timestamp)}
                </div>
                {/* display meeting status for community users: */}
                {!isAdmin() && (
                  <div
                    className={classNames("community-user-meeting-status", {
                      "progress-wrapper-started": isInProgress,
                    })}
                  >
                    {isInProgress && (
                      <>
                        <StatusInProgress className="status-icon" />
                      </>
                    )}
                    {meetingStatus.label}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="title">
            {t("header.city-council-meetings")}
            <br />
            {t("header.meeting-agenda")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingHeader;
