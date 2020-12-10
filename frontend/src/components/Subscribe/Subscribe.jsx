import React, { useState, useRef, useEffect } from 'react';
import './Subscribe.scss';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';
import BackNavigation from '../BackNavigation/BackNavigation';
import Spinner from '../Spinner/Spinner';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';

function Subscribe({
  createSubscription,
  isLoading,
  error,
  isSubscribed,
}) {
  const { id: meetingId } = useParams();
  const formEl = useRef(null);
  const [isPhoneChecked, setPhoneChecked] = useState(false);
  const [isEmailChecked, setEmailChecked] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Just rerender.
  }, [isLoading, error, isSubscribed]);

  const handlePhoneChecked = () => {
    setPhoneChecked(!isPhoneChecked);
  };

  const handleEmailChecked = () => {
    setEmailChecked(!isEmailChecked);
  };

  const handlePhoneChanged = (e) => {
    setPhone(e.target.value);
    if (e.target.value) {
      // Check phone checkbox by default if the phone is entered.
      setPhoneChecked(true);
    }
  };

  const handleEmailChanged = (e) => {
    setEmail(e.target.value);
    if (e.target.value) {
      // Check email checkbox by default if the email is entered.
      setEmailChecked(true);
    }
  };

  const handleSubmit = (e) => {
    if (!phone || !email || !formEl.current.checkValidity()) {
      return;
    }
    e.preventDefault();

    createSubscription({
      variables: {
        phone_number: phone,
        email_address: email,
        meeting_id: parseInt(meetingId, 10),
        meeting_item_id: 1, // TODO handle only one of meeting_id or meeting_item_id?
      },
    });
  };

  return (
    <div className={classnames('subscribe-view')}>
      <BackNavigation />
      <div className="wrapper">
        <div className="text">
          <h3>Subscribe to item</h3>
          <p>
            Subscribe to receive a notification when this item is up next
            for discussion and when discussions for this item begin.
          </p>
        </div>

        <form className="form" ref={formEl}>
          <div className="input-group">
            <div className="checkbox-group">
              <CustomCheckbox
                checked={isPhoneChecked}
                onClick={handlePhoneChecked}
              />
              <label htmlFor="phoneChbox" onClick={handlePhoneChecked}>Subscribe to text notifications</label>
            </div>
            <input
              type="tel"
              placeholder="Enter phone number"
              required={isPhoneChecked}
              value={phone}
              onChange={handlePhoneChanged}
            />
          </div>
          <div className="input-group">
            <div className="checkbox-group">
              <CustomCheckbox
                checked={isEmailChecked}
                onClick={handleEmailChecked}
              />
              <label htmlFor="emailChbox" onClick={handleEmailChecked}>Subscribe to email notifications</label>
            </div>
            <input
              type="email"
              placeholder="Enter email address"
              required={isEmailChecked}
              value={email}
              onChange={handleEmailChanged}
            />
          </div>
          <div className="row">
            { !isLoading
              && (
                <button
                  type="submit"
                  disabled={!isPhoneChecked || !isEmailChecked || !phone || !email}
                  onClick={handleSubmit}
                >
                  { `Subscribe${isSubscribed ? 'd!' : ''}` }
                </button>
              )}
            { isLoading && <Spinner /> }
          </div>
          { error && <div>{ error.message }</div> }
        </form>
      </div>
    </div>
  );
}

export default Subscribe;
