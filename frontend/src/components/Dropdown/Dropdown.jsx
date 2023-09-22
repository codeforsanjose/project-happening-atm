import React, { useState, useEffect, useRef } from 'react';

import classNames from 'classnames';
import { KeyboardArrowDownIcon } from '../../utils/_icons';
import './Dropdown.scss';
import { useTranslation } from 'react-i18next';

/*
 * A re-usable dropdown component for viewing/managing dropdown selections such as
 * meeting status and meeting agenda item status
 * props: options, value, onChange, className
 * 	options: the list of possible dropdown values
 *	value: the currently selected dropdown value (per 'controlled form input' pattern)
 * 	onChange: event handler for when (admin) user selects new dropdown value
 *  className: styling for diff dropdown use cases
 */
function Dropdown({ options, value, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef();
  const { t } = useTranslation();
  const propsClassName = className;
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handler = (event) => {
      // 1st check to ensure dropdown (ref) element is currently visible on screen
      if (!dropDownRef.current) return;
      // then check if click is outside dropdown
      if (!dropDownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handler, true);

    return () => {
      // return cleanup function for dismounting of dropdown component
      document.removeEventListener('click', handler);
    };
  }, []);

  const handleOptionClick = (option) => {
    // Close Dropdown
    setIsOpen(false);
    // handle the option the user selected (clicked):
    onChange(option);
  };

  // construct open dropdown w/ diff selection options
  const renderedOptions = options.map((option) => {
    return (
      <input
        key={option.value}
        type="button"
        className={classNames(
          // apply addtl styling to indicate currently selected option
          option.value === value.value ? 'dropdown-item-selected' : '',
          'dropdown-item', // apply standard styling for all options
          option.class
        )}
        value={t(option.label)}
        disabled={
          option.value === value.value ||
          (propsClassName === 'meeting-status' && option.value === 'UPCOMING') // indicate can't revert mtg status to 'upcoming'
            ? true
            : false
        }
        onClick={() => handleOptionClick(option)}
      ></input>
    );
  });

  return (
    <div ref={dropDownRef} className="dropdown">
      {!isOpen && (
        <button
          type="button"
          className={classNames(
            value.class,
            'dropdown-item',
            'selector',
            className,
            'panel'
          )}
          onClick={handleClick}
        >
          {t(value?.label) || 'Select...'}
          <KeyboardArrowDownIcon
            className={classNames(className, 'dropdown-arrow')}
          />
        </button>
      )}
      {isOpen && (
        <div className={classNames('dropdown-open', className)}>
          {renderedOptions}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
