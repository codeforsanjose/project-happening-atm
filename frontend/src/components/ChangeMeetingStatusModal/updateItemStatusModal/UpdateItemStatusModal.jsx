import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';

import Modal from 'react-modal/lib/components/Modal';
import { useTranslation } from 'react-i18next';
import './UpdateItemStatusModal.scss';
import { CloseIcon, ArrowUpwardIcon } from '../../../utils/_icons';
import { UPDATE_MEETING_ITEM } from '../../../graphql/graphql';

/**
 * Presentation component that lets the user comfirm the chaange in item status
 *
 * props: item, itemRef, dropDownRef, setDisplaySetStatusModal, setDisableSort
 *    item
 *      The agenda item itself, from agendaItem.jsx
 *    dropDownRef
 *      Dom reference to the button element in agendaItem.jsx
 *    setDisplaySetStatusModal
 *      Flag to display the wrapper modal established by changeMeetingStatusModal
 *    setDisbleSort
 *      Disables sorting of agenda items while modal is displayed
 *    refetchAllMeeting
 *      Gets all meetings query
 *    oldStatus
 *      Contains the class,value,status of the old meeting button
 *    newStatus
 *      Contains the class,value,status of the new meeting button
 */

function updateTheItem(updateItem, item, newStatus) {
  updateItem({
    variables: {
      id: item.id,
      order_number: item.order_number,
      status: newStatus,
      content_categories: item.content_categories,
      item_start_timestamp: item.item_start_timestamp,
      item_end_timestamp: item.item_end_timestamp,
      description_loc_key: item.description_loc_key,
      title_loc_key: item.title_loc_key,
      parent_meeting_item_id: item.parent_meeting_item_id,
    },
  });
}

const UpdateItemStatusModal = ({
  args,
}) => {
  const {
    item, setShowItemStatusModal, setDisplaySetStatusModal, oldStatus, newStatus, refetchAllMeeting,
  } = args;

  const { t } = useTranslation();
  const [updateItem, { error }] = useMutation(UPDATE_MEETING_ITEM,
    { onCompleted: () => { refetchAllMeeting(); setDisplaySetStatusModal(false); } });
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
          <span className="headerText">
            {t('meeting.tabs.agenda.status.modal.title2')}
          </span>
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
          <div className="buttonsAndArrow statusButtons">
            <input className={`${oldStatus.class} fakeButton`} type="button" value={oldStatus.value} />
            <div><ArrowUpwardIcon /></div>
            <input className={`${newStatus.class} fakeButton`} type="button" value={newStatus.value} />
          </div>
          {/* Must do this for this localization to have bold words. */}
          {/* eslint-disable-next-line react/no-danger */}
          <p className="statusChangeDescription" dangerouslySetInnerHTML={{ __html: t('meeting.tabs.agenda.status.modal.description', { interpolation: { escapeValue: false } }) }} />
          <div className="publishOrCancelButtons">
            <input
              type="button"
              className="publish"
              value={t('standard.buttons.publish')}
              onClick={() => {
                updateTheItem(updateItem, item, newStatus.status);
              }}
              onKeyPress={() => {
                updateTheItem(updateItem, item, newStatus.status);
              }}
            />
            <input
              type="button"
              className="cancel"
              value={t('standard.buttons.cancel')}
              onClick={() => setShowItemStatusModal(false)}
              onKeyPress={() => { setShowItemStatusModal(false); }}
            />
          </div>
          {error && <p className="error">An Error has Occured</p>}

        </div>
      </div>
    </Modal>
  );
};

export default UpdateItemStatusModal;
