import React, { useRef, useState } from 'react';
import './AdminUploadView.scss';

import { ReactComponent as PublishIcon } from '../../../../assets/publish-24px.svg';
import AdminUploadConfirmModal from './AdminUploadConfirmModal';
import DragAndDrop from './DragAndDrop';

function AdminUploadView() {
  const fileInputRef = useRef();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fileList, setFileList] = useState(null);

  function handleFileChange() {
    const fileRef = fileInputRef.current;
    // TODO: Validate files?
    setFileList(fileRef.files);
    setShowConfirmModal(true);
  }

  function handleFileDrop(files) {
    // TODO: Validate dropped files?
    setFileList(files);
    setShowConfirmModal(true);
  }

  function resetUpload() {
    fileInputRef.current.value = '';
    setFileList(null);
    setShowConfirmModal(false);
  }

  function closeModal(e) {
    if (e.target !== e.currentTarget) return;
    resetUpload();
  }

  function confirmModal() {
    uploadCSV(fileList);
    // TODO: Display success/confirmation, handle errors
    resetUpload();
  }

  /** Send CSV file to back end */
  function uploadCSV(fileList) {
    console.log('Uploading: ', fileList);
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
          fileName={fileList[0].name}
          closeModal={closeModal}
          confirmModal={confirmModal}
        />
      }
    </div>
  )
}

export default AdminUploadView;