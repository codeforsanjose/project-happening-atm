import React from 'react';
import './SuccessModal.scss';
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
 *    headerText
 *      A string header message of the modal
 *    confirmModal
 *      A function/callback provided to the modal confirm button
 *    confirmText
 *      A string displayed on the confirmation button of the modal
 */

function SuccessModal({
  isOpen,
  closeModal,
  headerText,
  confirmModal,
  confirmText,
}) {
  return (
    <Modal
      isOpen={isOpen}
      className="SuccessModal"
      overlayClassName="modal-overlay"
      onRequestClose={closeModal}
    >
      <div className="modal-header">
        <ConfirmationIcon />
      </div>
      <div className="modal-body">
        <h4>
          {headerText}
        </h4>
        <div className="row">
          <button
            type="button"
            className='modal-button'
            onClick={confirmModal}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default SuccessModal;
