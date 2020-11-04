import React, { useRef, useState } from 'react';
import './AdminUploadView.scss';

import { ReactComponent as PublishIcon } from '../../../assets/publish-24px.svg';
import AdminUploadConfirmModal from './AdminUploadConfirmModal';
import DragAndDrop from './DragAndDrop';

function AdminUploadView() {
  const fileInputRef = useRef();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange() {
    const fileRef = fileInputRef.current;
    // TODO: Validate files:
    // https://github.com/codeforsanjose/gov-agenda-notifier/issues/32
    setSelectedFile(fileRef.files[0]);
    setShowConfirmModal(true);
  }

  function handleFileDrop(files) {
    // TODO: Validate dropped files:
    // https://github.com/codeforsanjose/gov-agenda-notifier/issues/32
    setSelectedFile(files[0]);
    setShowConfirmModal(true);
  }

  function resetUpload() {
    fileInputRef.current.value = '';
    setSelectedFile(null);
    setShowConfirmModal(false);
  }

  function closeModal(e) {
    if (e.target !== e.currentTarget) return;
    resetUpload();
  }

  function confirmModal() {
    uploadCSV(selectedFile);
    // TODO: Display success/confirmation, handle errors:
    // https://github.com/codeforsanjose/gov-agenda-notifier/issues/32
    resetUpload();
  }

  /** Send CSV file to back end */
  function uploadCSV(selectedFile) {
    console.log('Uploading: ', selectedFile);
    // TODO: Implement upload:
    // https://github.com/codeforsanjose/gov-agenda-notifier/issues/32
  }

  return (
    <div className="admin-upload">
      <DragAndDrop dropHandler={handleFileDrop}>
        <div className="upload-area">
          <PublishIcon />
          <p>Drag and Drop CSV File</p>
          <label for="csv">
            Or Upload from your Computer
          </label>
          <input
            className="visually-hidden"
            type="file"
            name="csv"
            id="csv"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
      </DragAndDrop>

      {showConfirmModal &&
        <AdminUploadConfirmModal
          fileName={selectedFile.name}
          closeModal={closeModal}
          confirmModal={confirmModal}
        />
      }
    </div>
  )
}

export default AdminUploadView;