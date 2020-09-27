import React, { useState } from 'react';
import './Subscribe.scss';
import classnames from 'classnames';
import SubscribeViaEmail from './SubscribeViaEmail';
import SubscribeViaText from './SubscribeViaText';
import { Link } from 'react-router-dom';

function Subscribe() {
    const [showTextForm, setShowTextForm] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    return (
        <div className={classnames('subscribe-view')}>
            <Link to="/">Back</Link>
            <h1>Subscribe to City Council Agenda Item</h1>
            <p>Get notified:</p>
            <ul>
                <li>when the item is up next</li>
                <li>when discussions about the item have started</li>
                <li>when discussions about the item have ended</li>
                <li>if the agenda item is rescheduled</li>
            </ul>
            <h3>How do you want to be notified?</h3>
            <div className={classnames('button-row')}>
                <button onClick={() => setShowEmailForm(true)}>Email</button>
                <button onClick={() => setShowTextForm(true)}>Text</button>
            </div>

            <SubscribeViaEmail
                showEmailForm={showEmailForm}
                setShowEmailForm={setShowEmailForm}
            />
            <SubscribeViaText
                showTextForm={showTextForm}
                setShowTextForm={setShowTextForm}
            />
        </div>
    );
}

export default Subscribe;