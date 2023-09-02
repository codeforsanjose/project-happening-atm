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

const useDeleteMeetingNew = ({ id, meeting_start_timestamp }) => {
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

  const modalHeaderText = t("meeting.list.delete-meeting.modal.title");
  const modalBodyText = error
    ? `There was an error, Please try again. ${date} - ${time}`
    : `${date} - ${time}`;

  // different language support can be added later as this is for Admins anyhow
  const modalActionButton = (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="action-button delete-meeting"
    >
      Delete
    </button>
  );
  const modalCancelButton = (
    <button
      type="button"
      className="cancel-button"
      onClick={() => {
        closeModal();
      }}
    >
      {t("standard.buttons.cancel")}
    </button>
  );

  const DeleteModal = () =>
    showModal ? (
      <ConfirmationModal
        isOpen={showModal}
        closeModal={closeModal}
        headerText={modalHeaderText}
        bodyText={modalBodyText}
        actionButton={modalActionButton}
        cancelButton={modalCancelButton}
        className="delete-meeting-modal"
      />
    ) : null;

  return [openModal, DeleteModal];
};

export default useDeleteMeetingNew;
