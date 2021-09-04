/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
import useCreateMeeting from "../../hooks/useCreateMeeting";

// Asset imports
import { JoinMeetingIcon } from "../../utils/_icons";

function AdminMeetingListViewLinks() {
  const { t } = useTranslation();
  const [openCreateModal, CreateModal] = useCreateMeeting();
  /* component texts */
  const buttonText = "meeting.list.new-meeting.button";

  return (
    <div className="meeting-links">
      {/* <Link to="#"> */}
        <button
          type="button"
          className="create-meeting"
          onClick={openCreateModal}
        >
          <JoinMeetingIcon/>
          <p>{t(buttonText)}</p>
        </button>
      {/* </Link> */}
      <CreateModal />
    </div>
  );
}

export { AdminMeetingListViewLinks };
