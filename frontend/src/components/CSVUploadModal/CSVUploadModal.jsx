/* eslint-disable no-console */
import React from 'react';
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
  return (
    <Modal
      style={{ overlay: overlayStyle }}
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      className="CSVUploadModal"
    >
      <div className="wrapper">
        <button type="button" onClick={closeModal} className="close-modal">
          <CancelIcon />
        </button>
        <h2>Upload New Agenda</h2>

        <DragAndDrop dropHandler={() => console.log('hi')}>
          <div className="upload-area">
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
                onChange={() => console.log('hi')}
                ref={() => console.log('hi')}
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
