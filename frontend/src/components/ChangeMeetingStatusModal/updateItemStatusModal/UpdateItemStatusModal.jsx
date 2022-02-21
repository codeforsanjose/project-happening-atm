import React, { useState, useEffect } from 'react';

import Modal from 'react-modal/lib/components/Modal';
import './UpdateItemStatusModal.scss';
import { CloseIcon } from '../../../utils/_icons';

const style = {
  overlay: {
    backgroundColor: 'none',
  },
};

const UpdateItemStatusModal = (
) => {
  Modal.setAppElement('#root');

  return (
    <Modal style={style} className="UpdateItemStatusModal" isOpen>
      <div className="updateItemStatusWrapper">
        <div className="updateItemStatusHeader">
          <span>Update Item Status</span>
          <CloseIcon />
        </div>
        <div>Body</div>
      </div>
    </Modal>
  );
};

export default UpdateItemStatusModal;
