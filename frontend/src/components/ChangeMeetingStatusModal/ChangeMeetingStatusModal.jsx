import React, { useState, useEffect } from 'react';

import Modal from 'react-modal/lib/components/Modal';
import { useTranslation } from 'react-i18next';
import './ChangeMeetingStatusModal.scss';
import UpdateItemStatusModal from './updateItemStatusModal/UpdateItemStatusModal';
import { CloseIcon } from '../../utils/_icons';
import MeetingItemStates from '../../constants/MeetingItemStates';

/**
 * This is the component for subscribe confirmation modal window.
 *
 * props:
 *    numberOfSubscriptions
 *      A number of successful subscriptions
 *    onClose
 *      A function/callback which is called when the window is being closed
 */

function buildItemStyle(itemRef) {
  const rect = itemRef.getBoundingClientRect();
  const xPos = rect.left;
  const yPos = rect.top;

  return {
    width: `${itemRef.clientWidth}px`,
    height: `${itemRef.clientHeight}px`,
    position: 'absolute',
    left: `${xPos}px`,
    top: `${yPos}px`,
  };
}

function buildListStyle(dropDownRef) {
  const rect = dropDownRef.getBoundingClientRect();
  const xPos = rect.left;
  const yPos = rect.top;

  return {
    width: `${dropDownRef.clientWidth}px`,
    position: 'absolute',
    left: `${xPos}px`,
    top: `${yPos}px`,
  };
}

function closeTheModal(setDisplaySetStatusModal, setDisableSort) {
  // remove blur effect, reenable the scrollX
  document.querySelector('#root').style.filter = 'none';
  document.querySelector('#root').style.overflowX = 'visible';

  setDisableSort(false);
  setDisplaySetStatusModal(false);
}

function buildButtonClasses(t) {
  return [
    {
      status: MeetingItemStates.PENDING,
      class: 'upComing',
      value: t('meeting.tabs.agenda.status.options.upcoming'),
    },
    {
      status: MeetingItemStates.IN_PROGRESS,
      class: 'inProgress',
      value: t('meeting.tabs.agenda.status.options.in-progress'),
    },
    {
      status: MeetingItemStates.COMPLETED,
      class: 'completed',
      value: t('meeting.tabs.agenda.status.options.completed'),
    },
    {
      status: 'toBeImplemented',
      class: 'onHold',
      value: t('meeting.tabs.agenda.status.options.on-hold'),
    },
    {
      status: MeetingItemStates.DEFERRED,
      class: 'deffered',
      value: t('meeting.tabs.agenda.status.options.deferred'),
    },
  ];
}

function buildButtonList(itemStatus, setShowItemStatusModal, setNewStatus, buttonClasses) {
  const jsx = [];
  const keyPrefix = 'giberish';
  buttonClasses.forEach((elem, i) => {
    const key = keyPrefix + i;

    if (itemStatus === elem.status) {
      jsx.unshift(<li key={key}><input className={`${elem.class} fakeButton`} type="button" value={elem.value} /></li>);
    } else {
      jsx.push(<li key={key}><input onClick={() => { setShowItemStatusModal(true); setNewStatus(elem); }} className={elem.class} type="button" value={elem.value} /></li>);
    }
  });
  return jsx;
}

const ChangeMeetingStatusModal = ({
  item, itemRef, dropDownRef, setDisplaySetStatusModal, setDisableSort,
}) => {
  Modal.setAppElement('#root');
  const { t } = useTranslation();
  const [itemStyle, setItemStyle] = useState(buildItemStyle(itemRef.current));
  const [listStyle, setListStyle] = useState(buildListStyle(dropDownRef.current));
  const [cloneItem] = useState(itemRef.current.cloneNode(true));
  const [contentRef, setContentRef] = useState(null);
  const [showItemStatusModal, setShowItemStatusModal] = useState(false);
  const [buttonClasses] = useState(buildButtonClasses(t));
  const [oldStatus] = useState(buttonClasses.filter((elem) => elem.status === item.status)[0]);
  const [newStatus, setNewStatus] = useState(null);

  const modalStyle = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgb(31, 40, 71, 0.65)',
    },
  };

  useEffect(() => {
    const eventListenerFunction = () => {
      setItemStyle(buildItemStyle(itemRef.current));
      setListStyle(buildListStyle(dropDownRef.current));
    };

    // blur background, and hide the scroll bar it causes
    document.querySelector('#root').style.filter = 'blur(20px)';
    document.querySelector('#root').style.overflowX = 'hidden';

    // setup responsiveness for the absolute positioned element
    window.addEventListener('scroll', eventListenerFunction);
    window.addEventListener('resize', eventListenerFunction);

    return () => {
      window.removeEventListener('scroll', eventListenerFunction);
      window.removeEventListener('resize', eventListenerFunction);
    };
  }, [itemRef, dropDownRef, cloneItem]);

  // attach the cloned item
  useEffect(() => {
    if (contentRef != null && !showItemStatusModal) {
      document.querySelector('#theChangeMeetingStatusModalWrapper').appendChild(cloneItem);
    }
  }, [contentRef, cloneItem, showItemStatusModal]);
  return (

    <Modal contentRef={(node) => { setContentRef(node); }} style={modalStyle} className="ChangeMeetingStatusModal" isOpen>

      {!showItemStatusModal && (
      <div>
        {/* Use effect is attaching a cloned item to here */}
        <div style={itemStyle} id="theChangeMeetingStatusModalWrapper" className="modalAgendaItemWrapper" />
        <div className="listModalWrapper" style={listStyle}>
          <div
            className="closeOutModal"
            onClick={() => {
              closeTheModal(setDisplaySetStatusModal, setDisableSort);
            }}
            onKeyPress={() => { closeTheModal(setDisplaySetStatusModal, setDisableSort); }}
            role="button"
            tabIndex={0}
          >
            <span className="closeOutText">{t('standard.buttons.close')}</span>
            <CloseIcon />
          </div>
          <ul className="buttonStyles">
            { buildButtonList(item.status, setShowItemStatusModal, setNewStatus, buttonClasses)}
          </ul>
        </div>
      </div>
      )}
      {showItemStatusModal
      && (
      <UpdateItemStatusModal
        setShowItemStatusModal={setShowItemStatusModal}
        item={item}
        oldStatus={oldStatus}
        newStatus={newStatus}
      />
      )}
    </Modal>
  );
};

export default ChangeMeetingStatusModal;
