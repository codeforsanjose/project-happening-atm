import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import './ChangeMeetingStatusOuterModal.scss';

import { CloseIcon } from '../../../utils/_icons';

/**
 * This is the component for displaying the first change status modal,
 * lets admin pick the status to change to
 *
 * props: item, itemRef, dropDownRef, setDisplaySetStatusModal, setDisableSort
 *    item
 *      The agenda item itself, from agendaItem.jsx
 *    itemRef
 *      Dom refernce to AgendaItem outer wrapper from agendaItem.jsx
 *    dropDownRef
 *      Dom reference to the button element in agendaItem.jsx
 *    setDisplaySetStatusModal
 *      Controls the display of the first outer modal
 *    setDisbleSort
 *      Disables sorting of agenda items while modal is displayed
 */

function buildStyle(itemRef) {
  const rect = itemRef.getBoundingClientRect();
  const xPos = rect.left;
  const yPos = rect.top;

  return {
    width: `${itemRef.clientWidth}px`,
    position: 'absolute',
    left: `${xPos}px`,
    top: `${yPos}px`,
  };
}

function buildCloseOutStyle(itemRef) {
  const rect = itemRef.getBoundingClientRect();
  const xPos = rect.left;
  const yPos = rect.top;

  const offSetX = itemRef.clientWidth - 75;
  const offSetY = -40;
  return {
    left: `${xPos + offSetX}px`,
    top: `${yPos + offSetY}px`,
  };
}

function closeTheModal(setDisplaySetStatusModal, setDisableSort) {
  setDisableSort(false);
  setDisplaySetStatusModal(false);
}

function buildButtonList(itemStatus, setShowItemStatusModal, setNewStatus, buttonClasses) {
  const jsx = [];
  const keyPrefix = 'button-list-';
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

const ChangeMeetingStatusOuterModal = ({
  contentRef, itemRef, dropDownRef, setDisplaySetStatusModal,
  setDisableSort, item, setShowItemStatusModal, setNewStatus, buttonClasses,
}) => {
  const { t } = useTranslation();
  const [itemStyle, setItemStyle] = useState(buildStyle(itemRef.current));
  const [listStyle, setListStyle] = useState(buildStyle(dropDownRef.current));
  const [closeOutStyle, setCloseOutStyle] = useState(buildCloseOutStyle(itemRef.current));

  useEffect(() => {
    const eventListenerFunction = () => {
      setItemStyle(buildStyle(itemRef.current));
      setListStyle(buildStyle(dropDownRef.current));
      setCloseOutStyle(buildCloseOutStyle(itemRef.current));
    };

    // setup responsiveness for the absolute positioned element
    window.addEventListener('scroll', eventListenerFunction);
    window.addEventListener('resize', eventListenerFunction);

    return () => {
      window.removeEventListener('scroll', eventListenerFunction);
      window.removeEventListener('resize', eventListenerFunction);
    };
  }, [itemRef, dropDownRef]);

  // attach the cloned item
  useEffect(() => {
    if (contentRef != null) {
      setItemStyle(buildStyle(itemRef.current));
      setListStyle(buildStyle(dropDownRef.current));
      setCloseOutStyle(buildCloseOutStyle(itemRef.current));
      const cloneItem = itemRef.current.cloneNode(true);
      cloneItem.querySelector('.statusButtons').style.visibility = 'hidden';
      document.querySelector('#theChangeMeetingStatusModalWrapper').appendChild(cloneItem);
    }
  }, [contentRef, itemRef, dropDownRef]);

  return (
    <div className="ChangeMeetingStatusOuterModal">
      {/* Use effect is attaching a cloned item to here */}
      <div style={itemStyle} id="theChangeMeetingStatusModalWrapper" className="modalAgendaItemWrapper" />

      <div
        style={closeOutStyle}
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

      <div className="listModalWrapper" style={listStyle}>
        <ul className="statusButtons">
          { buildButtonList(item.status, setShowItemStatusModal, setNewStatus, buttonClasses)}
        </ul>
      </div>
    </div>

  );
};

export default ChangeMeetingStatusOuterModal;
