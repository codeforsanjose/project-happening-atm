import React from 'react';
import './SubscribeViaEmail.scss';
import classnames from 'classnames';

function SubscribeViaEmail({ showEmailForm, setShowEmailForm }) {
  return (
    <div className={classnames('subscribe-via-email-view', {
      hide: !showEmailForm,
    })}
    >
      <button type="button" onClick={() => setShowEmailForm(false)}>Back</button>
      <h1>Enter Email Address</h1>
      <p>Receive email notifications for this agenda item.</p>
      <input type="text" />
      <button type="button">Subscribe</button>
    </div>
  );
}

export default SubscribeViaEmail;
