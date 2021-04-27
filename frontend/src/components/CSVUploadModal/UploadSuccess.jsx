import React from 'react';
import './UploadSuccess.scss';
import classnames from 'classnames';
import Modal from 'react-modal';
import { ConfirmationIcon } from '../../utils/_icons';

/**
 * This is the component for upload success modal window.
 *
 * props:
 *    isOpen
 *      A boolean indicating if the modal is open
 *    closeModal
 *      A function/callback which is called when the window is being closed
 *    confirmModal
 *      A function/callback provided to the modal confirm button
 *    confirmText
 *      A string displayed on the confirmation button of the modal
 */

function UploadSuccess({
  isOpen,
  closeModal,
  confirmModal,
  confirmText,
}) {
  return (
    <Modal
      isOpen={isOpen}
      className={classnames('upload-confirmation')}
      overlayClassName="modal-overlay"
      onRequestClose={closeModal}
    >
      <div className="modal-header">
        <ConfirmationIcon />
      </div>
      <div className="modal-body">
        <h4>
          Agenda Successfully Uploaded!
        </h4>
        <div className="row">
          <button
            type="button"
            onClick={confirmModal}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default UploadSuccess;
