/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toTimeString, i18Date } from '../utils/timestampHelper';
import { DELETE_MEETING } from '../graphql/mutation';
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';

/**
 * Used to implement meeting deletion on a page.
 *
 *  * props: (destructured from meeting object)
 *    id
 *      (meeting) Id number used to delete the specific meeting
 *    startTime
 *      Timestamp of meeting start time used for display
 *
 * Returns:
 *  openModal
 *    Callback function to show the delete modal
 *  DeleteModal
 *    Modal component
 */

const useDeleteMeeting = ({ id, meeting_start_timestamp }) => {
  const history = useHistory();
  // allow mtg list page to refresh after deleting mtg from indiv. mtg view page
  // https://stackoverflow.com/questions/53963060/react-router-navigating-through-history-push-refreshes-the-page
  const historyBrowser = createBrowserHistory({
    basename: process.env.PUBLIC_URL,
    forceRefresh: true,
  });

  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const clearAndCloseModal = () => {
    setShowModal(false);
    // refresh page if on mtg list page o/wise if on
    // indiv. mtg view page, navigate to mtg list page and refresh
    history.location.pathname === '/'
      ? history.go(0)
      : historyBrowser.push('/');
  };

  const openModal = () => {
    setShowModal(true);
  };

  const [deleteMeeting, { loading, error }] = useMutation(DELETE_MEETING);
  const time = toTimeString(meeting_start_timestamp);

  const handleDelete = async () => {
    await deleteMeeting({ variables: { id: id } });
    if (!error) {
      clearAndCloseModal();
    } else if (error) {
      console.error(error);
    }
  };

  // internationalization (i.e. "i18") of days of week for meeting date/time display
  const { i18Day, i18Month, i18DayNumber } = i18Date(meeting_start_timestamp);
  const i18DateString = `${i18Day}, ${i18Month} ${i18DayNumber}`;

  const modalHeaderText = t('meeting.list.delete-meeting.modal.title');
  // different language support can be added later as this is for Admins anyhow
  const modalBodyText = error
    ? `There was an error, Please try again. ${i18Date()} - ${time}`
    : `${i18DateString} - ${time}`;

  const DeleteModal = () =>
    showModal ? (
      <ConfirmationModal
        isOpen={showModal}
        closeModal={closeModal}
        headerText={modalHeaderText}
        bodyText={modalBodyText}
        confirmButtonText={t(
          'meeting.list.delete-meeting.modal.buttons.delete'
        )}
        onConfirm={handleDelete}
        onCancel={() => closeModal()}
        className="delete-meeting-modal"
        contentLabel={t('meeting.list.delete-meeting.modal.title')}
      />
    ) : null;

  return [openModal, DeleteModal];
};

export default useDeleteMeeting;
