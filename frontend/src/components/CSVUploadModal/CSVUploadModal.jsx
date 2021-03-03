/* eslint-disable no-console */
import React, { useState, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import './CSVUploadModal.scss';

import DragAndDrop from './DragAndDrop';
import Spinner from '../Spinner/Spinner';
import { PublishIcon, CancelIcon } from '../../utils/_icons';

function CSVUploadModal({ isOpen, closeModal }) {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleFileChange() {
    const fileRef = fileInputRef.current;
    if (fileRef.files.length === 0) return;
    // TODO: Validate files:
    // https://github.com/codeforsanjose/gov-agenda-notifier/issues/32
    setSelectedFile(fileRef.files[0]);
  }

  const handleFileDrop = useCallback((files) => {
    if (files.length === 0) return;
    // TODO: Validate dropped files:
    // https://github.com/codeforsanjose/gov-agenda-notifier/issues/32
    setSelectedFile(files[0]);
  }, []);

  function clearSelectedFile() {
    fileInputRef.current.value = '';
    setSelectedFile(null);
  }

  function clearAndCloseModal() {
    setShowConfirm(false);
    setSelectedFile(null);
    closeModal();
  }

  function uploadCSV() {
    setShowConfirm(false);
    setIsLoading(true);

    // await upload csv
    setTimeout(() => {
      setIsLoading(false);
      clearSelectedFile();
    }, 5000);

    // loading end
    // success notification
  }

  const publishButtonText = isLoading
    ? 'Uploading and Publishing' : 'Upload and Publish';

  Modal.setAppElement('#root');
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={clearAndCloseModal}
      contentLabel="CSV Upload Modal"
      className="CSVUploadModal"
      overlayClassName="modal-overlay"
    >
      <div className="wrapper">
        <button type="button" onClick={clearAndCloseModal} className="cancel-button close-modal">
          <CancelIcon />
        </button>

        {
          showConfirm
            ? (
              <>
                <h2>Are you sure you want to upload a new agenda?</h2>

                <p className="confirm-message">
                  This action will overwrite the existing meeting and unsubscribe
                  and notify all subscribed users.
                </p>

                <div className="confirm-buttons">
                  <button
                    type="button"
                    className="modal-button"
                    onClick={uploadCSV}
                  >
                    Upload New Agenda
                  </button>
                  <button
                    type="button"
                    className="modal-button"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Upload New Agenda</h2>
                <DragAndDrop dropHandler={handleFileDrop}>
                  <div className="upload-area">
                    {selectedFile && (
                      <div className="file-preview">
                        <button type="button" onClick={clearSelectedFile} className="cancel-button cancel-file">
                          <CancelIcon />
                        </button>
                        <div className="csv-icon">csv</div>
                        <p>{selectedFile.name}</p>
                      </div>
                    )}

                    <PublishIcon />
                    <p>Drag and Drop CSV File</p>
                    <label htmlFor="csv">
                      Or Upload from your Computer
                      <input
                        className="visually-hidden"
                        type="file"
                        name="csv"
                        id="csv"
                        accept=".csv"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                </DragAndDrop>

                <button
                  type="button"
                  className="upload-button modal-button"
                  onClick={() => setShowConfirm(true)}
                  disabled={!selectedFile}
                >
                  {isLoading && <Spinner />}
                  {publishButtonText}
                </button>
              </>
            )
        }
      </div>
    </Modal>
  );
}

export default CSVUploadModal;
