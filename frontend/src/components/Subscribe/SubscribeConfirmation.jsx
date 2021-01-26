import React from 'react';
import './SubscribeConfirmation.scss';
import classnames from 'classnames';
import Modal from 'react-modal';
import { ConfirmationIcon } from '../../utils/_icons';

/**
 * This is the component for subscribe confirmation modal window.
 *
 * props:
 *    onClose
 *      A function/callback which is called when the window is being closed
 */

function SubscribeConfirmation({
  onClose,
}) {
  Modal.setAppElement('#root');
  return (
    <Modal
      isOpen
      style={
        {
          overlay: {
            zIndex: '3001',
          },
        }
      }
      className={classnames('subscribe-confirmation')}
    >
      <div className="modal-header">
        <ConfirmationIcon />
      </div>
      <div className="modal-body">
        {/*
          TODO adjust for multiple subscriptions
          https://github.com/codeforsanjose/gov-agenda-notifier/issues/101
        */}
        <h4>You have subscribed to the meeting!</h4>
        <p>
          Thank you for signing up. To verify your identity, please check your email
          and confirm your subscriptions.
        </p>
        <div className="row">
          <button
            type="button"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default SubscribeConfirmation;
