import React, {useState} from "react";
import { KeyboardArrowDownIcon } from '../../utils/_icons';


function Dropdown({ options, value, onChange }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionClick = (option) => {
		// Close Dropdown
		setIsOpen(false);
		// Determine what option the user clicked on:
		onChange(option);
	}

	const renderedOptions = options.map((option) => {
		return (
		<div onClick={() => handleOptionClick(option)} key={option.value}>{option.label}</div>
		);
	});


	return (
		<div>
			{!isOpen && <div onClick={handleClick}>{value?.label || 'Select...'} <KeyboardArrowDownIcon /></div>}		
			{isOpen && <div>{renderedOptions}</div>}
		</div>
	);
}

export default Dropdown;