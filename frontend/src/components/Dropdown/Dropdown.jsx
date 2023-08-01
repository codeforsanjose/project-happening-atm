import React, {useState, useEffect, useRef} from "react";
import Panel from "./Panel";
import classNames from "classnames";
import { KeyboardArrowDownIcon } from '../../utils/_icons';
import "./Dropdown.scss";

/*
* A re-usable dropdown component for viewing/managing dropdown selections such as
* meeting status and meeting item status
* props: options, value, onChange
* 	options: the list of possible dropdown values
*		value: the currently selected dropdown value (per 'controlled form input' pattern)
* 	onChange: event handler for when (admin) user selects new dropdown value
*/
function Dropdown({ options, value, onChange, dropDownType }) {
	const [isOpen, setIsOpen] = useState(false);
	const dropDownRef = useRef();

	// const statusStateClassMap = {
	// 	'UPCOMING': 'upcoming', 'IN PROGRESS': 'in-progress', 'IN RECESS': 2, 'ENDED': 3, 'DEFERRED': 4}
	// }
	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handler = (event) => {
			// 1st check to ensure reference element is currently visible on scree			
			if(!dropDownRef.current) return; 
			// check if click is outside dropdown
			if (!dropDownRef.current.contains(event.target)){
				setIsOpen(false);
			}
		}
		document.addEventListener('click', handler, true);

		return () => {
			document.removeEventListener('click', handler); // return cleanup function for dismounted dropdown
		}
	}, []);

	const handleOptionClick = (option) => {
		// Close Dropdown
		setIsOpen(false);
		// Determine what option the user clicked on:
		onChange(option);
	}

	const renderedOptions = options.map((option) => {
		return (
		<div
			className={classNames(
				option.label === value.label
				? 'dropdown-item-selected' : '',
				'dropdown-item',
				option.label.toLowerCase().split(' ').join('-')
			)}
			onClick={() => handleOptionClick(option)} 
			key={option.value}>{option.label}</div>
		);
	});


	return (
		<div ref={dropDownRef} className="dropdown-wrapper">
			{!isOpen && 
				<Panel 
					className={classNames(
							value.label.toLowerCase().split(' ').join('-'),
							'dropdown-item',
							'selector')}
					onClick={handleClick}>
						{value?.label || 'Select...'} 
					<KeyboardArrowDownIcon 
						className={dropDownType + '-dropdown-arrow'}/>
				</Panel>
			}		
			{isOpen && (
			<Panel >
				{renderedOptions}
			</Panel>
			)}
		</div>
	);
}

export default Dropdown;