import React from 'react';
import { useTranslation } from 'react-i18next';
import './BackNavigation.scss';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import { ChevronLeftIcon } from '../../utils/_icons';

export default function BackNavigation() {
  const { t } = useTranslation();

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={classnames('back-navigation')}>
      <div className="back-wrapper">
        <button
          type="button"
          onClick={goBack}
        >
          <ChevronLeftIcon />
          {t('standard.buttons.back')}
        </button>
      </div>
    </div>
  );
}
