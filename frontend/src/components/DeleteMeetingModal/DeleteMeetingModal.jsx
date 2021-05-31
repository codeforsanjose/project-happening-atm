/* eslint-disable no-console */
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Modal from 'react-modal';
import './DeleteMeetingModal.scss';
import { toDateString, toTimeString } from '../../utils/timestampHelper';
import uploadCSV from '../../utils/uploadHelper';

import SuccessModal from '../SuccessModal/SuccessModal';
import Spinner from '../Spinner/Spinner';
import { PublishIcon, CancelIcon } from '../../utils/_icons';
import { DELETE_MEETING } from '../../graphql/graphql';

/**
 * A modal to handle CSV Uploads.
 * Use the custom 'useCSVUpload' hook when implementing CSV uploads
 * on a page.
 *
 * props:
 *    isOpen
 *      Boolean state that indicates if the modal is shown
 *    closeModal
 *      Callback function to close the modal
 *    meetingId
 *      Number used to upload to specific meeting or create a new one if null
 *
 * state:
 *    selectedFile
 *      Current file selected by the file input
 *    isLoading
 *      Boolean loading state when uploading a file
 *    showConfirm
 *      Boolean indicating if confirmation modal is shown
 *    deleteSuccessful
 *      Boolean indicating if success modal is shown
 */

function DeleteMeetingModal({ isOpen, closeModal, meetingId, startTime }) {
  // const [deleteMeeting, { loading, error, data }] = useMutation(DELETE_MEETING);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);

  const date = toDateString(startTime);
  const time = toTimeString(startTime);

  function clearAndCloseModal() {
    setDeleteSuccessful(false);
    closeModal();
  }

  async function handleDelete() {
    try {
      setIsLoading(true);

      // deleteMeeting(meetingId);

      setDeleteSuccessful(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const deleteButtonText = isLoading
    ? 'Deleting' : 'Delete';

  Modal.setAppElement('#root');

  if (deleteSuccessful) {
    return (
      <SuccessModal
        isOpen={isOpen}
        closeModal={clearAndCloseModal}
        headerText="Meeting Successfully Deleted!"
        confirmModal={clearAndCloseModal}
        confirmText="Close"
      />
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={clearAndCloseModal}
      contentLabel="Delete Meeting"
      className="DeleteMeetingModal"
      overlayClassName="modal-overlay"
    >
      <div className="wrapper">
        <button type="button" onClick={clearAndCloseModal} className="cancel-button close-modal">
          <CancelIcon />
        </button>

        <h2>Are you sure you want to delete this meeting?</h2>
        <p className="delete-meeting-info">{`${date} - ${time}`}</p>

        <div className="modal-buttons">
          <button
            type="button"
            className="delete-button modal-button"
            onClick={handleDelete}
          >
            {isLoading && <Spinner />}
            {deleteButtonText}
          </button>

          <button
            type="button"
            className="modal-button"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteMeetingModal;
