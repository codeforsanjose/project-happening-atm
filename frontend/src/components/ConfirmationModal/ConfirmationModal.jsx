import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "../../utils/_icons";
// import Spinner from "../Spinner/Spinner"; // handled by the action bar
import "./ConfirmationModal.scss";
import classNames from "classnames";

/**
 * A common re-usable modal for Create / Update / Delete actions
 *
 * props:
 *    isOpen
 *      Boolean state that indicates if the modal is shown
 *    closeModal
 *      Callback function to close the modal
 * 		headerText
 * 			text to display in the modal header
 * 		bodyText
 *    	text to display in the modal body
 *		actionButton
 *			confirmation button (for updating/creating/deleting)
 *		cancelButton
 *			cancel button
 * 		className
 * 			any custom styling classes for given confirmation modal's use case
 */

function ConfirmationModal({
  isOpen,
  closeModal,
  headerText,
  bodyText,
  actionButton,
  cancelButton,
  className,
}) {
  const history = useHistory();
  const { t } = useTranslation();

  Modal.setAppElement("#root"); // enables react-modal to set aria-hidden = true for non-modal page content

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={classNames("confirmation-modal", className)}
      overlayClassName="modal-overlay"
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
        <div className="modal-buttons">
          {actionButton}
          {cancelButton}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
