import React from 'react';
import './CustomInput.scss';
import classnames from 'classnames';

/**
  * 10.2021 Update: Per product team direction, this component has
  * been retired. Users will instead subscribe with the initial
  * subscribe button, that now triggers subscriptions to be sent
  * directly to the registered contact info associated to their account.
  * 
  * The component for the custom input component.
  *
  * props:
  *    type
  *      The input type like 'text', 'email', 'tel', etc.
  *    placeholder
  *      The input's placeholder
  *    isRequired
  *      A boolean value that indicates whether this field is required
  *    isSubmitted
  *      A boolean value that indicates whether the corresponding to this input component form has
  *      been submitted
  *    value
  *      The input's value
  *    onChange
  *      The function that handles the input's changes event
  *    errorMessage
  *      A string with error message if there are any errors associated with this input element
  *    inputNote
  *      An optional note under this input field
  */

function CustomInput({
  type,
  placeholder,
  isRequired,
  isSubmitted,
  value,
  onChange,
  errorMessage,
  inputNote,
}) {
  return (
    <div className={classnames('custom-input-wrapper')}>
      <input
        className={classnames({ submitted: isSubmitted, error: errorMessage !== null })}
        type={type || 'text'}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange}
      />
      { inputNote
        && (
          <small>{ inputNote }</small>
        )}
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
