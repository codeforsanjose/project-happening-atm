import React, { useState } from 'react';
import CSVUploadModal from '../components/CSVUploadModal/CSVUploadModal';

const useCSVUpload = (id = null) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => { setShowModal(false); };
  const openModal = () => { setShowModal(true); };
  const renderUploadModal = () => (
    showModal
      ? (
        <CSVUploadModal
          isOpen={showModal}
          closeModal={closeModal}
          meetingId={id}
        />
      ) : null
  );

  return [openModal, renderUploadModal];
};

export default useCSVUpload;
