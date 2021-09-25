/* eslint-disable camelcase */
import React, { useState } from 'react';
import CreateMeetingModal from '../components/CreateMeetingModal/CreateMeetingModal';

/**
 * Used to implement meeting creation on a page.
 *
 * Returns:
 *  openModal
 *    Callback function to show the create meeting modal
 *  CreateModal
 *    Modal component
 */

const useCreateMeeting = () => {
	const [ showModal, setShowModal ] = useState(false);
	const closeModal = () => {
		setShowModal(false);
	};
	const openModal = () => {
		setShowModal(true);
	};

	const CreateModal = () => (showModal ? <CreateMeetingModal isOpen={showModal} closeModal={closeModal} /> : null);

	return [ openModal, CreateModal ];
};

export default useCreateMeeting;
