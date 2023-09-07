/* eslint-disable camelcase */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { toDateString, toTimeString } from "../utils/timestampHelper";
import { DELETE_MEETING } from "../graphql/mutation";
import ConfirmationModal from "../components/ConfirmationModal/ConfirmationModal";

/**
 * Used to implement meeting deletion on a page.
 *
 *  * props: (destructured from meeting object)
 *    id
 *      (meeting) Id number used to delete the specific meeting
 *    startTime
 *      Timestamp of meeting start time used for display
 *
 * Returns:
 *  openModal
 *    Callback function to show the delete modal
 *  DeleteModal
 *    Modal component
 */

const useDeleteMeeting = ({ id, meeting_start_timestamp }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const clearAndCloseModal = () => {
    setShowModal(false);
    history.go(0);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const [deleteMeeting, { loading, error }] = useMutation(DELETE_MEETING);
  const date = toDateString(meeting_start_timestamp, "dddd, MMM D");
  const time = toTimeString(meeting_start_timestamp);

  const handleDelete = async () => {
    await deleteMeeting({ variables: { id: id } });
    if (!error) {
      clearAndCloseModal();
    } else if (error) {
      console.error(error);
    }
  };

  // internationalization (i.e. "i18") of days of week for meeting day/time display
  const i18Date = () => {
    const i18DayIndex = new Date(Number(meeting_start_timestamp)).getDay();
    const i18MonthIndex = new Date(Number(meeting_start_timestamp)).getMonth();
    return (
      t("standard.weekdays", { returnObjects: true })[i18DayIndex] +
      ", " +
      t("standard.months", { returnObjects: true })[i18MonthIndex] +
      " " +
      date.split(" ")[2]
    );
  };

  const modalHeaderText = t("meeting.list.delete-meeting.modal.title");
  // different language support can be added later as this is for Admins anyhow
  const modalBodyText = error
    ? `There was an error, Please try again. ${i18Date()} - ${time}`
    : `${i18Date()} - ${time}`;

  const DeleteModal = () =>
    showModal ? (
      <ConfirmationModal
        isOpen={showModal}
        closeModal={closeModal}
        headerText={modalHeaderText}
        bodyText={modalBodyText}
        confirmButtonText={t(
          "meeting.list.delete-meeting.modal.buttons.delete"
        )}
        onConfirm={handleDelete}
        onCancel={() => closeModal()}
        className="delete-meeting-modal"
        contentLabel={t("meeting.list.delete-meeting.modal.title")}
      />
    ) : null;

  return [openModal, DeleteModal];
};

export default useDeleteMeeting;
