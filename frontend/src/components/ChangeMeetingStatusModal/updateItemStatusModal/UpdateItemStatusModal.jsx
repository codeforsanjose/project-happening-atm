import React, { useEffect } from 'react';

import Modal from 'react-modal/lib/components/Modal';
import { useTranslation } from 'react-i18next';
import './UpdateItemStatusModal.scss';
import { CloseIcon, ArrowUpwardIcon } from '../../../utils/_icons';

const UpdateItemStatusModal = ({ setShowItemStatusModal, oldStatus, newStatus }) => {
  const { t } = useTranslation();

  const modalOverlayStyle = {
    overlay: {
      backgroundColor: 'none',
    },
  };

  useEffect(() => {
    document.querySelector('body').style.overflow = 'hidden';

    return () => {
      document.querySelector('body').style.overflow = 'visible';
    };
  }, []);

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
            <div><ArrowUpwardIcon /></div>
            <input className={`${newStatus.class} fakeButton`} type="button" value={newStatus.value} />
          </div>
          <p className="statusChangeDescription">
            This action will
            {' '}
            <strong>publish changes</strong>
            {' '}
            to the agenda item status
            {' '}
            <strong>and notify all users.</strong>
          </p>
          <div className="publishOrCancelButtons">
            <input type="button" className="publish" value={t('standard.buttons.publish')} />
            <input type="button" className="cancel" value={t('standard.buttons.cancel')} />
          </div>

        </div>
      </div>
    </Modal>
  );
};

export default UpdateItemStatusModal;
