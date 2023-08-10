import React, { useState, useEffect, useRef } from 'react';

import classNames from "classnames";
import { KeyboardArrowDownIcon } from "../../utils/_icons";
import "./Dropdown.scss";
import { useTranslation } from "react-i18next";

/*
 * A re-usable dropdown component for viewing/managing dropdown selections such as
 * meeting status and meeting item status
 * props: options, value, onChange, dropdownType
 * 	options: the list of possible dropdown values
 *	value: the currently selected dropdown value (per 'controlled form input' pattern)
 * 	onChange: event handler for when (admin) user selects new dropdown value
 *  dropdownType: an identifier to differentiate diff dropdown use cases and associated styling as necessary
 */
function Dropdown({ options, value, onChange, dropdownType }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef();
  const { t } = useTranslation();

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
          option.value === value.value ? "dropdown-item-selected" : "",
          "dropdown-item", // apply standard styling for all options
          option.class
        )}
        onClick={() => handleOptionClick(option)}
      >
        {t(option.label)}
      </div>
    );
  });

  return (
    <div ref={dropDownRef} className="dropdown">
      {!isOpen && (
        <button
					type="button"
          className={classNames(
            value.class,
            "dropdown-item",
            "selector",
            dropdownType
          )}
          onClick={handleClick}
        >
          {t(value?.label) || 'Select...'}
          <KeyboardArrowDownIcon
            className={classNames(
              dropdownType + "-dropdown-arrow",
              "dropdown-arrow"
            )}
          />
        </button>
      )}
      {isOpen && (
        <div className={classNames('dropdown-open', className)}>
          {renderedOptions}
        </div>
      )}
      {isOpen && (
        <div className={classNames("dropdown-wrapper", dropdownType)}>
          {renderedOptions}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
