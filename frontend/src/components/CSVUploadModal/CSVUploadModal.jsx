/* eslint-disable no-console */
import React, { useState, useRef, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import './CSVUploadModal.scss';
import uploadCSV from '../../utils/uploadHelper';

import DragAndDrop from './DragAndDrop';
import Spinner from '../Spinner/Spinner';
import UploadSuccess from './UploadSuccess';
import { PublishIcon, CancelIcon } from '../../utils/_icons';

/**
 * A modal to handle CSV Uploads.
 * Use the custom 'useCSVUpload' hook when implementing CSV uploads
 * on a page.
 *
 * props:
 *    isOpen
 *      Boolean state that indicates if the modal is shown
 *    closeModal
 *      Callback function to close the modal
 *    meetingId
 *      Number used to upload to specific meeting or create a new one if null
 *
 * state:
 *    selectedFile
 *      Current file selected by the file input
 *    isLoading
 *      Boolean loading state when uploading a file
 *    showConfirm
 *      Boolean indicating if confirmation modal is shown
 *    uploadSuccessful
 *      Boolean indicating if success modal is shown
 */

function CSVUploadModal({ isOpen, closeModal, meetingId = null }) {
  const fileInputRef = useRef();
  const history = useHistory();
  const { pathname } = useLocation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);

  function handleFileChange() {
    const fileRef = fileInputRef.current;
    if (fileRef.files.length === 0) return;
    setSelectedFile(fileRef.files[0]);
  }

  const handleFileDrop = useCallback((files) => {
    if (files.length === 0 || files[0].type !== 'text/csv') return;
    setSelectedFile(files[0]);
  }, []);

  function clearSelectedFile() {
    fileInputRef.current.value = '';
    setSelectedFile(null);
  }

  function clearAndCloseModal() {
    setShowConfirm(false);
    setSelectedFile(null);
    setUploadSuccessful(false);
    closeModal();
  }

  function redirectToMeeting() {
    history.push(`/meeting/${meetingId}`);
  }

  async function handleUpload() {
    setShowConfirm(false);
    setIsLoading(true);

    const response = await uploadCSV(selectedFile, meetingId);
    setIsLoading(false);
    clearSelectedFile();

    if (!response.error) {
      setUploadSuccessful(true);
    } else {
      // TODO: Error message display
      console.log(response.error);
    }
  }

  const redirect = pathname === '/';
  const publishButtonText = isLoading
    ? 'Uploading and Publishing' : 'Upload and Publish';

  Modal.setAppElement('#root');

  if (uploadSuccessful) {
    return (
      <UploadSuccess
        isOpen={isOpen}
        closeModal={clearAndCloseModal}
        confirmModal={redirect ? redirectToMeeting : clearAndCloseModal}
        confirmText={redirect ? 'Go to Meeting' : 'Close'}
      />
    );
  }

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
                    onClick={handleUpload}
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
