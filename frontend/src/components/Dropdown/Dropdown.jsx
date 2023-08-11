import React, { useState, useEffect, useRef } from 'react';

import Panel from './Panel';
import classNames from 'classnames';
import { KeyboardArrowDownIcon } from '../../utils/_icons';
import './Dropdown.scss';

/*
 * A re-usable dropdown component for viewing/managing dropdown selections such as
 * meeting status and meeting item status
 * props: options, value, onChange, dropDownType
 * 	options: the list of possible dropdown values
 *	value: the currently selected dropdown value (per 'controlled form input' pattern)
 * 	onChange: event handler for when (admin) user selects new dropdown value
 *  dropDownType: an identifier to differentiate diff dropdown use cases and associated styling as necessary
 */
function Dropdown({ options, value, onChange, dropDownType }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef();

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
      <div
        key={option.value}
        className={classNames(
          // apply addtl styling to indicate currently selected option
          option.value.toLowerCase() === value.value.toLowerCase()
            ? 'dropdown-item-selected'
            : '',
          'dropdown-item', // apply standard styling for all options
          option.value.toLowerCase().split(' ').join('-')
        )}
        onClick={() => handleOptionClick(option)}
      >
        {option.label}
      </div>
    );
  });

  return (
    <div ref={dropDownRef} className="dropdown">
      {!isOpen && (
        <Panel
          className={classNames(
            value.value.toLowerCase().split(' ').join('-'),
            'dropdown-item',
            'selector'
          )}
          onClick={handleClick}
        >
          {value?.label || 'Select...'}
          <KeyboardArrowDownIcon
            className={classNames(dropDownType + '-dropdown-arrow', 'icon')}
          />
        </Panel>
      )}
      {isOpen && <Panel className="dropdown-wrapper">{renderedOptions}</Panel>}
    </div>
  );
}

export default Dropdown;
