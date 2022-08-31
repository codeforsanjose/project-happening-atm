import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import Modal from 'react-modal/lib/components/Modal';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from '../../../utils/_icons';
import { UPDATE_MEETING_ITEM } from '../../../graphql/graphql';

import './UpdateItemStartTimeModal.scss';

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
      backdropFilter: 'blur(20px)'
    },
  };

  const handleModalClose = () => setDisplaySetStartTimeModal(false);

  const validateNewTime = (hour, minutes, meridian) => {
    const { errors } = formFields;
    const timeError = !(hour <= 12 && hour > 0 && minutes < 60 && minutes >= 0);
    const meridianError = meridian === '';
    // no need to update state on submit unless it has changed
    if (errors.time !== timeError || errors.meridian !== meridianError) {
      displayFormErrors(timeError, meridianError);
    }
    return !timeError && !meridianError ? true : false;
  };

  const displayFormErrors = (time, meridian) => {
    setFormFields(prevFormFields => ({
      ...prevFormFields,
      errors: {
        time,
        meridian
      }
    }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prevFormFields => ({
      ...prevFormFields,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { hour, minutes, meridian } = formFields;
    const newTime = new Date();
    let newHour = parseInt(hour, 10);
    const newMinutes = parseInt(minutes, 10);
    const isValidTime = validateNewTime(newHour, newMinutes, meridian);
    if (!isValidTime) return;
    const isPM = meridian === 'PM' ? true : false;

    // if hour is 12 we set it to 0 to account for 12pm
    newHour = newHour === 12 ? 0 : newHour;

    if (isPM) {
      newHour = newHour + 12;
    }
    newTime.setHours(newHour, newMinutes, 0);

    updateItem({
      variables: {
        ...item,
        item_start_timestamp: `${newTime.getTime()}`
      },
    });
  };

  Modal.setAppElement('#root');

  return (
    <Modal style={modalOverlayStyle} className="updateStartTimeModal" isOpen>
      <div className="updateStartTimeWrapper">
        <div className="updateStartTimeHeader">
          <span className="headerText">
            {t('meeting.tabs.agenda.status.modal.set-time.title')}
          </span>
          <button
            className="close"
            onClick={handleModalClose}
            onKeyPress={handleModalClose}
            aria-label={t('standard.buttons.close')}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="updateStartTimeModalBody">
          <form>
            <span>Time</span>
            <div className="form-inputs">
              <label className="visually-hidden" htmlFor="hour">
                {t('meeting.tabs.agenda.status.modal.set-time.label.hour')}
              </label>
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
              <label className="visually-hidden" htmlFor="minutes">
                {t('meeting.tabs.agenda.status.modal.set-time.label.minutes')}
              </label>
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
              <span className={formFields.errors.time ? 'visible' : null}>
                {t('meeting.tabs.agenda.status.modal.set-time.error.time')}
              </span>
              <span className={formFields.errors.meridian ? 'visible' : null}>
                {t('meeting.tabs.agenda.status.modal.set-time.error.meridian')}
              </span>
            </div>
            <div className="publishOrCancelButtons">
              <input
                type="button"
                className="publish"
                value={t('standard.buttons.publish')}
                onClick={handleSubmit}
                onKeyPress={handleSubmit}
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