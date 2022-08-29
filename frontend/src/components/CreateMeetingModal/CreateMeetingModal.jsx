/* eslint-disable no-console */
import React, { useCallback, useState, forwardRef } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";

//date picker functionality
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import vi from "date-fns/locale/vi";

import { CREATE_MEETING } from "../../graphql/graphql";
import "./CreateMeetingModal.scss";
import Spinner from "../Spinner/Spinner";

// Asset imports
import { CalendarBlueIcon, ScheduleBlueIcon } from "../../utils/_icons";

/**
 * A modal to create a new meeting.
 * Uses the custom 'useCreateModal' hook when implementing meeting
 * creation.
 *
 * props:
 *    isOpen
 *      Boolean state that indicates if the modal is shown
 *    closeModal
 *      Callback function to close the modal
 *
 * state:
 *    createSuccessful
 *      Boolean indicating if success modal is shown
 */
function CreateMeetingModal({ isOpen, closeModal }) {
  const history = useHistory();
  const { t } = useTranslation();
  registerLocale("es", es);
  registerLocale("vi", vi);
  const language = useTranslation("home").i18n.language;
  setDefaultLocale(language);
  const [createMeeting, { loading }] = useMutation(CREATE_MEETING);
  const [createSuccessful, setCreateSuccessful] = useState(false);
  const [zoomLink, setZoomLink] = useState('');

  //date picker functionality
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow);

  const handleChange = (date) => {
    setDate(date);
  };

  const getMinDate = () => {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  /* component internationalized texts */
  const title = "meeting.list.new-meeting.modal.title";
  const subtitle = "meeting.list.new-meeting.modal.subtitle";
  const dateInput = "meeting.list.new-meeting.modal.inputs.date";
  const timeInput = "meeting.list.new-meeting.modal.inputs.time";
  const cancelButtonText = "meeting.list.new-meeting.modal.buttons.cancel";
  const createButtonText =
    "meeting.list.new-meeting.modal.buttons.create-meeting";
  const buttonClickedText =
    "meeting.list.new-meeting.modal.buttons.creating-meeting";

  const clearAndCloseModal = useCallback(() => {
    setCreateSuccessful(false);
    closeModal();
  }, [closeModal]);

  const refresh = useCallback(() => {
    history.go(0);
  }, [history]);

  const handleAction = async () => {
    try {
      const timestamp = date.getTime();
      if (date < new Date()) {
        alert(
          "Warning: Meeting start time is in the past.  Please select a different start time."
        );
      }
      // ToDo: meeting url hardcoded for now, requires zoom api to trigger new url automatically upon mtg creation (?)
      // https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate
      await createMeeting({
        variables: {
          meeting_start_timestamp: `${timestamp}`,
          virtual_meeting_url: `${zoomLink}`,
        },
      });
      setCreateSuccessful(true);
    } catch (e) {
      console.error(e);
    }
  };

  const addZoomLink = (link) => {
    setZoomLink(link);
  }

  // custom input for calendar icon in date selector input field
  const CustomCalendarInput = forwardRef(
    ({ onChange, value, placeholderText, onClick }, ref) => (
      <label>
        <input
          placeholder={placeholderText}
          onChange={onChange}
          value={value}
          onClick={onClick}
        />
        <CalendarBlueIcon className="calendar-icon" onChange={onChange} />
      </label>
    )
  );

  // custom input for clock icon (aka schedule icon) in time selector input field
  const CustomTimeInput = forwardRef(
    ({ onChange, value, placeholderText, onClick }, ref) => (
      <label>
        <input
          placeholder={placeholderText}
          onChange={onChange}
          value={value}
          onClick={onClick}
        />
        <ScheduleBlueIcon className="calendar-icon" onChange={onChange} />
      </label>
    )
  );

  Modal.setAppElement("#root");

  // load refreshed meeting list if meeting successfully created
  if (createSuccessful) {
    refresh();
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={clearAndCloseModal}
      contentLabel="Create Meeting"
      className="CreateMeetingModal"
      overlayClassName="modal-overlay"
    >
      <div className="wrapper">
        <h2>{t(title)}</h2>
        <p>{t(subtitle)}</p>
        <div className="date-time">
          <div className="date-time-picker">
            <div>
              <p className="date-time-title">{t(dateInput)}</p>
              <DatePicker
                selected={date}
                minDate={getMinDate()}
                showPopperArrow={false}
                placeholderText="mm/dd/yyyy"
                onChange={handleChange}
                customInput={<CustomCalendarInput />}
              />
            </div>
          </div>
          <div className="date-time-picker">
            <div>
              <p className="date-time-title">{t(timeInput)}</p>
              <DatePicker
                selected={date}
                onChange={handleChange}
                showPopperArrow={false}
                value={date.setMinutes(Math.ceil(date.getMinutes() / 30) * 30)}
                minTime={new Date().setHours(7, 0)}
                maxTime={new Date().setHours(22, 0)}
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="h:mm aa"
                showTimeSelect={true}
                customInput={<CustomTimeInput />}
              />
            </div>
          </div>
          <div className="date-time-picker">
            <div>
              <p className="date-time-title">Zoom Link</p>
              <input type="text" onChange={(event) => addZoomLink(event.target.value)}/>
            </div>
          </div>
        </div>
        <div className="modal-buttons">
          <button
            type="button"
            className="cancel-button modal-button"
            onClick={clearAndCloseModal}
          >
            {t(cancelButtonText)}
          </button>
          <button
            type="button"
            className="create-button modal-button"
            // disabled={}
            onClick={handleAction}
          >
            {loading && <Spinner />}
            {loading ? t(buttonClickedText) : t(createButtonText)}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CreateMeetingModal;
