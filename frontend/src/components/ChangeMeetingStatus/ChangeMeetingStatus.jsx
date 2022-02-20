import React, { useState, useEffect } from 'react';

import Modal from 'react-modal/lib/components/Modal';
// eslint-disable-next-line import/no-cycle
import { RenderedAgendaItem } from '../MeetingView/AgendaView/AgendaItem';
import './ChangeMeetingStatus.scss';

import { CloseIcon } from '../../utils/_icons';
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
  // remove blur effect
  document.querySelector('#root').style.filter = 'none';
  setDisableSort(false);
  setDisplaySetStatusModal(false);
}

const ChangeMeetingStatus = ({
  args, itemRef, dropDownRef, setDisplaySetStatusModal, setDisableSort,
}) => {
  Modal.setAppElement('#root');
  const [itemStyle, setItemStyle] = useState(buildItemStyle(itemRef.current));
  const [listStyle, setListStyle] = useState(buildListStyle(dropDownRef.current));

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

    // blur background
    document.querySelector('#root').style.filter = 'blur(20px)';

    window.addEventListener('scroll', eventListenerFunction);
    window.addEventListener('resize', eventListenerFunction);

    return () => {
      window.removeEventListener('scroll', eventListenerFunction);
      window.removeEventListener('resize', eventListenerFunction);
    };
  }, [itemRef, dropDownRef]);

  return (

    <Modal style={modalStyle} className="ChangeMeetingStatus" isOpen>

      <div style={itemStyle} className="modalAgendaItemWrapper">
        <RenderedAgendaItem {...args} />
      </div>

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
          <span className="closeOutText">Close</span>
          <CloseIcon />
        </div>
        <ul className="buttonStyles">
          <li><input className="upComing" type="button" value="Upcoming" /></li>
          <li><input className="inProgress" type="button" value="In Progress" /></li>
          <li><input className="completed" type="button" value="Completed" /></li>
          <li><input className="onHold" type="button" value="On Hold" /></li>
          <li><input className="deffered" type="button" value="Deffered" /></li>
        </ul>
      </div>

    </Modal>

  );
};

export default ChangeMeetingStatus;
