import React from 'react';
import './AdminUploadConfirmModal.scss';

function AdminUploadConfirmModal({ fileName, closeModal, confirmModal }) {
  return (
    <div className="AdminUploadConfirmModal" onClick={closeModal}>
      <div className="inner">
        <p>
          Upload '
          {fileName}
          '?
        </p>
        <button onClick={closeModal}>Cancel</button>
        <button onClick={confirmModal}>Upload</button>
      </div>
    </div>
  );
}

export default AdminUploadConfirmModal;
