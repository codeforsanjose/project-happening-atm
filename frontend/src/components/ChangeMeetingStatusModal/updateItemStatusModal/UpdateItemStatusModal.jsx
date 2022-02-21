import React from 'react';

import Modal from 'react-modal/lib/components/Modal';
import './UpdateItemStatusModal.scss';
import { CloseIcon } from '../../../utils/_icons';

const UpdateItemStatusModal = ({ setShowItemStatusModal, oldStatus, newStatus }) => {
  const modalOverlayStyle = {
    overlay: {
      backgroundColor: 'none',
    },
  };

  Modal.setAppElement('#root');

  return (
    <Modal style={modalOverlayStyle} className="UpdateItemStatusModal" isOpen>
      <div className="updateItemStatusWrapper">
        <div className="updateItemStatusHeader">
          <span className="headerText">Update Item Status</span>
          <div
            className="closeOutModal"
            onClick={() => setShowItemStatusModal(false)}
            onKeyPress={() => { setShowItemStatusModal(false); }}
            role="button"
            tabIndex={0}
          >
            <CloseIcon className="closeOutIcon" />
          </div>
        </div>
        <div className="updateItemStatusModalBody">
          <div className="buttonsAndArrow buttonStyles">
            <input className={`${oldStatus.class} fakeButton`} type="button" value={oldStatus.value} />
            <div>An Arrow</div>
            <input className={`${newStatus.class} fakeButton`} type="button" value={newStatus.value} />
          </div>
          <p className="statusChangeDescription">Stuff Goes here</p>
          <div className="publishOrCancelButtons">
            <input type="button" className="publish" value="Publish" />
            <input type="button" className="cancel" value="Cancel" />
          </div>

        </div>
      </div>
    </Modal>
  );
};

export default UpdateItemStatusModal;
