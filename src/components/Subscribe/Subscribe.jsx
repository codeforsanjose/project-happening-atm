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
            <div className="wrapper">
                <Link to="/">Back</Link>

                <div className="text">
                    <h1>Subscribe to item</h1>
                    <p>
                        Receive a notification when this item is up next and when discussions have started.
                    </p>
                </div>

                <div className="form">
                    <div className="input-group">
                        <label htmlFor="phone">Text Notification</label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email Notification</label>
                        <input
                            type="text"
                            placeholder="Enter your email address"
                        />
                    </div>
                    <button>Subscribe</button>
                </div>
            </div>
        </div>
    );
}

export default Subscribe;