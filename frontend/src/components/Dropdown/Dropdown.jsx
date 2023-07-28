import React, {useState} from "react";

function Dropdown({ options }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionClick = (option) => {
		// Close Dropdown
		setIsOpen(false);
		// Determine what option the user clicked on:
		console.log(option);
	}

	const renderedOptions = options.map((option) => {
		return (
		<div onClick={() => handleOptionClick(option)} key={option.value}>{option.label}</div>
		);
	});

	return (
		<div>
			<div onClick={handleClick}>Select...</div>
			{isOpen && <div>{renderedOptions}</div>}
		</div>
	);
}

export default Dropdown;