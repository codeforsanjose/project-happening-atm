import React, { useState } from 'react';
import CSVUploadModal from '../components/CSVUploadModal/CSVUploadModal';

/**
 * Used to implement CSV Upload on a page.
 * Pass in a meeting id to specify a meeting to upload to,
 * or leave as null to upload to a new meeting.
 *
 * Returns:
 *  openModal
 *    Callback function to show the CSV upload modal
 *  UploadModal
 *    Modal component
 */

const useCSVUpload = ({ id = null }) => {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => { setShowModal(false); };
  const openModal = () => { setShowModal(true); };

  const UploadModal = () => (
    showModal
      ? (
        <CSVUploadModal
          isOpen={showModal}
          closeModal={closeModal}
          meetingId={id}
        />
      ) : null
  );

  return [openModal, UploadModal];
};

export default useCSVUpload;
