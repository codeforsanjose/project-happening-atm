/* eslint-disable no-console */
import React, { useState, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import './CSVUploadModal.scss';

import DragAndDrop from './DragAndDrop';
import { PublishIcon, CancelIcon } from '../../utils/_icons';

const overlayStyle = {
  display: 'grid',
  placeItems: 'center',
  zIndex: 10000,
  backdropFilter: 'blur(2px)',
  backgroundColor: 'rgba(0,0,0,0.2)',
};

function CSVUploadModal({ isOpen, closeModal }) {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

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

  return (
    <Modal
      style={{ overlay: overlayStyle }}
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      className="CSVUploadModal"
    >
      <div className="wrapper">
        <button type="button" onClick={closeModal} className="cancel-button close-modal">
          <CancelIcon />
        </button>
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
          className="upload-button"
          onClick={() => console.log('hi')}
        >
          Upload and Publish
        </button>
      </div>
    </Modal>
  );
}

export default CSVUploadModal;
