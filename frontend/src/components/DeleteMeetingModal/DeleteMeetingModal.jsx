/* eslint-disable no-console */
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import { useMutation } from '@apollo/client';
import { toDateString, toTimeString } from '../../utils/timestampHelper';
import { CancelIcon } from '../../utils/_icons';
import { DELETE_MEETING } from '../../graphql/graphql';
import './DeleteMeetingModal.scss';

import SuccessModal from '../SuccessModal/SuccessModal';
import Spinner from '../Spinner/Spinner';

/**
 * A modal to meeting deletion.
 * Use the custom 'useDeleteModal' hook when implementing deletion
 * on a page.
 *
 * props:
 *    isOpen
 *      Boolean state that indicates if the modal is shown
 *    closeModal
 *      Callback function to close the modal
 *    meetingId
 *      Id number used to delete the specific meeting
 *    startTime
 *      Timestamp of meeting start time used for display
 *
 * state:
 *    deleteSuccessful
 *      Boolean indicating if success modal is shown
 */

function DeleteMeetingModal({
  isOpen,
  closeModal,
  meetingId,
  startTime,
}) {
  const history = useHistory();
  const [deleteMeeting, { loading }] = useMutation(DELETE_MEETING);
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);

  const date = toDateString(startTime);
  const time = toTimeString(startTime);

  const clearAndCloseModal = useCallback(() => {
    setDeleteSuccessful(false);
    closeModal();
  }, [closeModal]);

  const refresh = useCallback(() => {
    history.go(0);
  }, [history]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMeeting({ variables: { id: meetingId } });
      setDeleteSuccessful(true);
    } catch (e) {
      console.error(e);
    }
  }, [deleteMeeting, meetingId]);

  Modal.setAppElement('#root');

  if (deleteSuccessful) {
    return (
      <SuccessModal
        isOpen={isOpen}
        closeModal={refresh}
        headerText="Meeting Successfully Deleted!"
        confirmModal={refresh}
        confirmText="Return"
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
            disabled={loading}
          >
            {loading && <Spinner />}
            {loading ? 'Deleting' : 'Delete'}
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
