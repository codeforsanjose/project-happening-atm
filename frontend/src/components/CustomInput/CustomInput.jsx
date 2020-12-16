import React from 'react';
import './CustomInput.scss';
import classnames from 'classnames';

/**
  * TODO properties description
  */

function CustomInput({
  type,
  placeholder,
  isRequired,
  isSubmitted,
  value,
  onChange,
  errorMessage,
}) {
  return (
    <div className={classnames('custom-input-wrapper')}>
      <input
        className={classnames({ submitted: isSubmitted })}
        type={type || 'text'}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange}
      />
      { errorMessage
        && (
          <div className="input-error">
            { errorMessage }
          </div>
        )}
    </div>
  );
}

export default CustomInput;
