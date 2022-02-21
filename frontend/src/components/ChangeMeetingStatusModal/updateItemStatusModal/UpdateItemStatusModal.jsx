import React, { useState, useEffect } from 'react';

import Modal from 'react-modal/lib/components/Modal';
import './UpdateItemStatusModal.scss';
import { CloseIcon } from '../../../utils/_icons';
import MeetingItemStates from '../../../constants/MeetingItemStates';

const UpdateItemStatusModal = (
) => {
  const [buttonClasses] = useState({
    completed: {
      status: MeetingItemStates.COMPLETED,
      class: 'completed',
    },
  });
  const style = {
    overlay: {
      backgroundColor: 'none',
    },
  };

  Modal.setAppElement('#root');

  return (
    <Modal style={style} className="UpdateItemStatusModal" isOpen>
      <div className="updateItemStatusWrapper">
        <div className="updateItemStatusHeader">
          <span className="headerText">Update Item Status</span>
          <div className="closeOutModal">
            <CloseIcon className="closeOutIcon" />
          </div>
        </div>
        <div className="updateItemStatuModalBody">
          <div className="buttonsAndArrow">
            <input type="button" value="blah" />
            <div>An Arrow</div>
            <input type="button" value="button2" />
            <p className="statusChangeDescription">Stuff Goes here</p>
            <div className="publishOrCancelButtons">
              <input type="button" className="publish" value="Publish" />
              <input type="button" className="cancel" value="Cancel" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateItemStatusModal;
