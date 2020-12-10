import React from 'react';
import './BackNavigation.scss';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import { ChevronLeftIcon } from '../../utils/_icons';

export default function BackNavigation() {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={classnames('back-navigation')}>
      <div className="wrapper">
        <button
          type="button"
          onClick={goBack}
        >
          <ChevronLeftIcon />
          Back
        </button>
      </div>
    </div>
  );
}
