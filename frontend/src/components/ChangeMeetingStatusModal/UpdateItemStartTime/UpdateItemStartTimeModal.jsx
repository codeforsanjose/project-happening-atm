import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import Modal from 'react-modal/lib/components/Modal';
import { useTranslation } from 'react-i18next';
import { CloseIcon, ArrowUpwardIcon } from '../../../utils/_icons';
import { UPDATE_MEETING_ITEM } from '../../../graphql/graphql';

import './UpdateItemStartTimeModal.scss';


function updateTheItem(updateItem, item, startTime) {
  updateItem({
    variables: {
      ...item,
      item_start_timestamp: startTime
    },
  });
}

const UpdateItemStartTimeModal = ({ args }) => {

  const {
    item, setDisplaySetStartTimeModal, refetchAllMeeting,
  } = args;


  const { t } = useTranslation();
  const [updateItem, { error }] = useMutation(UPDATE_MEETING_ITEM,
    { onCompleted: () => { refetchAllMeeting(); setDisplaySetStartTimeModal(false); } });
  const [formFields, setFormFields] = useState({
    hour: '',
    minutes: '',
    meridian: '',
    errors: {
      time: false,
      meridian: false,
    },
  });

  useEffect(() => {
    document.querySelector('body').style.overflow = 'hidden';

    return () => {
      document.querySelector('body').style.overflow = 'visible';
    };
  }, []);

  const modalOverlayStyle = {
    overlay: {
      backgroundColor: 'rgb(175, 178, 189, 0.5)',
      backdropFilter: 'blur(5px)'
    },
  };

  const handleModalClose = () => setDisplaySetStartTimeModal(false);
  
  Modal.setAppElement('#root');

  return (
    <Modal style={modalOverlayStyle} className="updateStartTimeModal" isOpen>
      <div className="updateStartTimeWrapper">
        <div className="updateStartTimeHeader">
          <span className="headerText">Set time</span>
          <CloseIcon
            className="closeOutIcon"
            onClick={handleModalClose}
            onKeyPress={handleModalClose}
          />
        </div>
        <div className="updateStartTimeModalBody">
          <form onSubmit={handleSubmit}>
            <span>Time</span>
            <div className="form-inputs">
              <input
                type="text"
                name="hour"
                id="hour"
                value={formFields.hour}
                placeholder="00"
                maxLength='2'
                onChange={handleChange}
              />
              <span>:</span>
              <input
                type="text"
                name="minutes"
                id="minutes"
                value={formFields.minutes}
                placeholder="00"
                maxLength='2'
                onChange={handleChange}
              />
              <input
                type="radio"
                name="meridian"
                id="am"
                value="AM"
                onChange={handleChange}
              />
              <label className='meridian-btn' htmlFor="am">
                <span>AM</span>
              </label>
              <input
                type="radio"
                name="meridian"
                id="pm"
                value='PM'
                onChange={handleChange}
              />
              <label className='meridian-btn' htmlFor="pm">
                <span>PM</span>
              </label>
            </div>
            <div className='error'>
              <span className={formFields.errors.time ? 'visible' : null}>Invalid time</span>
              <span className={formFields.errors.meridian ? 'visible' : null}>Choose AM/PM</span>
            </div>
            <button type="button" onClick={() => alert(`${new Date(Number(item.item_start_timestamp))}`)}>Current</button>
            <div className="publishOrCancelButtons">
              <input
                type="submit"
                className="publish"
                value={t('standard.buttons.publish')}
              />
              <input
                type="button"
                className="cancel"
                value={t('standard.buttons.cancel')}
                onClick={handleModalClose}
                onKeyPress={handleModalClose}
              />
            </div>
            {error && <p className="error">An Error has Occured</p>}
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateItemStartTimeModal;