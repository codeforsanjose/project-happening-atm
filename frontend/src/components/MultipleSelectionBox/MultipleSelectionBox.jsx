import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { getUserEmail, getUserPhone } from '../../utils/verifyToken';
import SubscribeConfirmation from '../Subscribe/SubscribeConfirmation';
import { CREATE_SUBSCRIPTIONS } from '../../graphql/graphql';
import Spinner from '../Spinner/Spinner';

import './MultipleSelectionBox.scss';
import classnames from 'classnames';
import { NotificationsIcon, ShareIcon } from '../../utils/_icons';
import { buildSubscriptionQueryString, convertQueryStringToServerFormat } from '../Subscribe/subscribeQueryString';

/*
* 10.2021 Update: Per product team direction, this component has
* been updated such that the subscribe button directly triggers 
* user subscriptions to be sent to the registered contact info 
* associated to the account.
* 
* subscriptions details:
*      Newly created subscriptions (response from the server)
*    createSubscriptions
*      The function that creates a subscription (or subscriptions) on the server
*    loading
*      A boolean values that indicates whether the communication with the server is in progress
*    error
*      An error object returned from the server if there is any error
*/

function MultipleSelectionBox({ selectedItems, handleCancel }) {
	const { t } = useTranslation();
	const history = useHistory();
	const [ subscriptions, setSubscriptions ] = useState(null);
	const [ createSubscriptions, { loading, error } ] = useMutation(CREATE_SUBSCRIPTIONS, {
		onCompleted: (data) => setSubscriptions(data?.createSubscriptions ?? null),
	});

	const getNumberOfSelectedMeetingItems = () => {
		let counter = 0;
		Object.keys(selectedItems).forEach((meetingId) => {
			counter += Object.keys(selectedItems[meetingId]).length;
		});
		return counter;
	};

	const handleSubscribe = () => {
		const phone = getUserPhone();
		const email = getUserEmail();
		const subscriptionQueryString = convertQueryStringToServerFormat(buildSubscriptionQueryString(selectedItems));

		createSubscriptions({
			variables: {
				phone_number: phone,
				email_address: email,
				meetings: subscriptionQueryString
			}
		});
	};

	const closeConfirmation = () => {
		history.go(0);
	};

	return (
		<div className={classnames('multiple-selection-box')}>
			<span className="bold">
				{getNumberOfSelectedMeetingItems()}
				&nbsp;
				{t('standard.words.selected')}
			</span>
			{subscriptions &&
			subscriptions.length > 0 && (
				<SubscribeConfirmation numberOfSubscriptions={subscriptions.length} onClose={closeConfirmation} />
			)}
			{error && <div className="form-error">{error.message}</div>}
			<span className="row action">
				<NotificationsIcon width={16} />
				{loading && <Spinner />}
				<button type="button" onClick={handleSubscribe}>
					{loading ? t('standard.buttons.subscribing') : t('standard.buttons.subscribe')}
				</button>
			</span>
			<span className="row action">
				<ShareIcon width={18} />
				<button type="button">{t('standard.buttons.share')}</button>
			</span>
			<button type="button" onClick={handleCancel}>
				{t('standard.buttons.cancel')}
			</button>
		</div>
	);
}

export default MultipleSelectionBox;
