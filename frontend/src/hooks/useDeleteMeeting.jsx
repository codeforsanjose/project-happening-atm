
import React, { useState } from 'react';
import DeleteMeetingModal from '../components/DeleteMeetingModal/DeleteMeetingModal';

/**
 * Used to implement meeting deletion on a page.
 *
 * Returns:
 *  openModal
 *    Callback function to show the delete modal
 *  DeleteModal
 *    Modal component
 */

const useDeleteMeeting = ({ id, meeting_start_timestamp }) => {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => { setShowModal(false); };
  const openModal = () => { setShowModal(true); };

  const DeleteModal = () => (
    showModal
      ? (
        <DeleteMeetingModal
          isOpen={showModal}
          closeModal={closeModal}
          meetingId={id}
          startTime={meeting_start_timestamp}
        />
      ) : null
  );

  return [openModal, DeleteModal];
};

export default useDeleteMeeting;
