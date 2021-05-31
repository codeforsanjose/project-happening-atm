
import React, { useState } from 'react';
import DeleteMeetingModal from '../components/DeleteMeetingModal/DeleteMeetingModal';

/**
 * Used to implement CSV Upload on a page.
 * Pass in a meeting id to specify a meeting to upload to,
 * or leave as null to upload to a new meeting.
 *
 * Returns:
 *  openModal
 *    Callback function to show the CSV upload modal
 *  renderUploadModal
 *    Function to render the component
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
