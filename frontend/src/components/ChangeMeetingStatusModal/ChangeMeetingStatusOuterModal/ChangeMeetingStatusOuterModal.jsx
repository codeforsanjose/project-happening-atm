import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import './ChangeMeetingStatusOuterModal.scss';

import { CloseIcon } from '../../../utils/_icons';

/**
 * This is the component for displaying the first change status modal,
 * lets admin pick the status to change to
 *
 * props: item, itemRef, dropDownRef, setDisplaySetStatusModal, setDisableSort
 *    contentRef
 *      This is the ref to the wrapper modal in changeMeetingStatusModal
 *    itemRef
 *      Dom refernce to AgendaItem outer wrapper from agendaItem.jsx
 *    dropDownRef
 *      Dom reference to the button element in agendaItem.jsx
 *    setDisplaySetStatusModal
 *      Flag to display the wrapper modal established by changeMeetingStatusModal
 *    buttonClasses
 *      Array of objects hold the status,class, and value for the buttons,
 *       this builds the buttons content and style
 *    setNewStatus
 *      Setter function from changeMEetingStatusModal, assigned one of the
 *      elements from buttonClasses
 *
 *
 */

function buildStyle(itemRef, dropDownRef = null) {
  const isStatusDropDown = dropDownRef !== null
  const itemRect = itemRef.getBoundingClientRect();
  const itemXPos = itemRect.left;
  const itemOffsetY = itemRect.height / 2

  if (!isStatusDropDown) {
    return {
      width: `${itemRef.clientWidth}px`,
      position: 'absolute',
      left: `${itemXPos}px`,
      top: `calc(50vh - ${itemOffsetY}px)`
    };
  }

  const dropDownRect = dropDownRef.getBoundingClientRect();
  const dropDownXPos = dropDownRect.left;
  const dropDownOffsetY = itemOffsetY - dropDownRect.height * 1.8

  return {
    width: `${dropDownRef.clientWidth}px`,
    position: 'absolute',
    left: `${dropDownXPos}px`,
    top: `calc(50vh + ${dropDownOffsetY}px)`
  };  
}

function buildCloseOutStyle(itemRef) {
  const rect = itemRef.getBoundingClientRect();
  const xPos = rect.left;

  const offSetX = itemRef.clientWidth - 75;
  const offSetY = 40;
  return {
    left: `${xPos + offSetX}px`,
    top: `calc(50vh - ${rect.height / 2 + offSetY}px)`
  };
}

function closeTheModal(setDisplaySetStatusModal) {
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
  args,
}) => {
  const {
    contentRef, itemRef, dropDownRef, setDisplaySetStatusModal,
    item, setShowItemStatusModal, setNewStatus, buttonClasses,
  } = args;

  const { t } = useTranslation();
  const [itemStyle, setItemStyle] = useState(buildStyle(itemRef.current));
  const [listStyle, setListStyle] = useState(buildStyle(itemRef.current, dropDownRef.current));
  const [closeOutStyle, setCloseOutStyle] = useState(buildCloseOutStyle(itemRef.current));

  useEffect(() => {
    document.querySelector('body').style.overflow = 'hidden';

    return () => {
      document.querySelector('body').style.overflow = 'visible';
    };
  }, []);
  
  useEffect(() => {
    const eventListenerFunction = () => {
      setItemStyle(buildStyle(itemRef.current));
      setListStyle(buildStyle(itemRef.current, dropDownRef.current));
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
      setListStyle(buildStyle(itemRef.current, dropDownRef.current));
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
          closeTheModal(setDisplaySetStatusModal);
        }}
        onKeyPress={() => { closeTheModal(setDisplaySetStatusModal); }}
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
