import React from 'react';
import './Spinner.scss';
import classnames from 'classnames';

export default function Spinner() {
  return (
    <div className={classnames('spinner-wrapper')}>
      <div className="spinner" />
    </div>
  );
}
