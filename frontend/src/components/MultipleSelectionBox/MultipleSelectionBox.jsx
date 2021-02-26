import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import './MultipleSelectionBox.scss';
import classnames from 'classnames';
import { NotificationsIcon, ShareIcon } from '../../utils/_icons';
import { buildSubscriptionQueryString } from '../Subscribe/subscribeQueryString';

function MultipleSelectionBox({
  selectedItems,
  handleCancel,
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const getNumberOfSelectedMeetingItems = () => {
    let counter = 0;
    Object.keys(selectedItems).forEach((meetingId) => {
      counter += Object.keys(selectedItems[meetingId]).length;
    });
    return counter;
  };

  const handleSubscribe = () => {
    history.push(`/subscribe?${buildSubscriptionQueryString(selectedItems)}`);
  };

  return (
    <div className={classnames('multiple-selection-box')}>
      <span className="bold">
        {getNumberOfSelectedMeetingItems()}
        &nbsp;
        {t('standard.words.selected')}
      </span>
      <span className="row action">
        <NotificationsIcon width={16} />
        <button type="button" onClick={handleSubscribe}>
          {t('standard.buttons.subscribe')}
        </button>
      </span>
      <span className="row action">
        <ShareIcon width={18} />
        <button type="button">
          {t('standard.buttons.share')}
        </button>
      </span>
      <button type="button" onClick={handleCancel}>
        {t('standard.buttons.cancel')}
      </button>
    </div>
  );
}

export default MultipleSelectionBox;
