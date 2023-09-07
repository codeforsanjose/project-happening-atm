import React, { useCallback, useState } from "react";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "../../utils/_icons";
import "./ConfirmationModal.scss";
import classNames from "classnames";

/**
 * A common re-usable confirmation modal used to confirm requested admin action
 * (e.g. such as deleting a meeting, changing a meeting status, changing an agenda item status etc)
 *
 * props:
 *    isOpen
 *      Boolean state that indicates if the modal is shown
 *    closeModal
 *      Callback function to close the modal
 * 		headerText
 * 			Text to display in the modal header
 * 		bodyText
 *    	Text to display in the modal body
 *		confirmButtonText
 *			Text to display on confirmation button (for updating/deleting etc.)
 *		onConfirm
				Callback function to be called when user (admin) clicks confirmation button
 *		disableConfirm
 *			Flag to indicate if confirmation button should be temporarily disabled (debounce purposes: avoid multi-clicks)
 *		onCancel
 *			Callback function to be called when user clicks cancel
 * 		className
 * 			Any custom styling classes for given confirmation modal's use case
 * 		contentLabel
 * 			react-modal provided prop for a11y purposes - provides a label for the modal content (via aria-label) 
 */

function ConfirmationModal({
  isOpen,
  closeModal,
  headerText,
  bodyText,
  confirmButtonText,
  onConfirm,
  disableConfirm,
  onCancel,
  className,
  contentLabel,
}) {
  const { t } = useTranslation();

  // modal-react requirement: enables react-modal to set aria-hidden = true for non-modal page content
  Modal.setAppElement("#root");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={classNames("confirmation-modal", className)}
      overlayClassName="modal-overlay"
      contentLabel={contentLabel}
    >
      <div className="modal-header">
        <h2>{headerText}</h2>
        <button
          type="button"
          className="close-modal"
          onClick={closeModal}
          aria-label={t("standard.buttons.close")}
        >
          <CloseIcon />
        </button>
      </div>
      <div className={classNames("modal-body", className)}>
        <p className="modal-body-text">{bodyText}</p>
        <div className={classNames("modal-buttons", className)}>
          <button
            type="button"
            onClick={onConfirm}
            disabled={disableConfirm}
            className={classNames("action-button", className)}
          >
            {confirmButtonText}
          </button>
          <button
            type="button"
            className={classNames("cancel-button", className)}
            onClick={onCancel}
          >
            {t("standard.buttons.cancel")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
