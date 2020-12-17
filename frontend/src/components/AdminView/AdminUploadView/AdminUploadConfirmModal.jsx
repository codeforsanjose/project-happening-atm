import React from 'react';
import './AdminUploadConfirmModal.scss';

function AdminUploadConfirmModal({ fileName, closeModal, confirmModal }) {
  return (
    <div className="AdminUploadConfirmModal" role="dialog">
      <div className="inner">
        <p>
          Upload &#39;
          {fileName}
          &#39;?
        </p>
        <button type="button" onClick={closeModal}>Cancel</button>
        <button type="button" onClick={confirmModal}>Upload</button>
      </div>
    </div>
  );
}

export default AdminUploadConfirmModal;
