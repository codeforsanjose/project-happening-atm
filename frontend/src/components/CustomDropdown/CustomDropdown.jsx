/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// TODO: Make the dropdown accessible:
// https://github.com/codeforsanjose/gov-agenda-notifier/issues/86
import React, { Component } from 'react';
import './CustomDropdown.scss';
import { KeyboardArrowDownIcon, KeyboardArrowUpIcon } from '../../utils/_icons';

class CustomDropdown extends Component {
  constructor(props) {
    super(props);
    // this.dropTogglerRef = React.createRef();
    // this.displayAreaRef = React.createRef();
    this.setDropTogglerRef = (ref) => {
      this.dropTogglerRef = ref;
    };
    this.setDisplayAreaRef = (ref) => {
      this.displayAreaRef = ref;
    };
    this.state = {
      isOpen: props.isOpen,
    };
  }

  componentDidMount() {
    // Assign click handler to listen the click to close the dropdown when clicked outside
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    // Remove the listener
    document.removeEventListener('click', this.handleClickOutside);
  }

  toggleDropDown = () => {
    const { onChange } = this.props;
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
    onChange && onChange(!isOpen);
  }

  // If click is outside the dropdown button or display area, close the dropdown
  handleClickOutside = (Event) => {
    const path = Event.composedPath(); // Gets the ancestor's hierarchy as an array
    const { onChange } = this.props;
    if (!path.includes(this.displayAreaRef) && !path.includes(this.dropTogglerRef)) {
      this.setState({
        isOpen: false,
      });
      onChange && onChange(false);
    }
  }

  render() {
    const { cellData, remainingOptions } = this.props;
    const { isOpen } = this.state;
    return (
      <div
        className="dropdown-wrapper"
        id={isOpen && 'dropdown-wrapper-active'}
      >

        <div
          className="current-status"
          onClick={this.toggleDropDown}
          ref={this.setDropTogglerRef}
        >
          <span>{cellData}</span>
          <span className="arrow-icon">
            {isOpen ? (
              <KeyboardArrowUpIcon style={{ fill: 'white' }} />
            ) : (
              <KeyboardArrowDownIcon style={{ fill: 'white' }} />
            )}
          </span>
        </div>
        <div className="remaining-options">
          {isOpen && (
            <div ref={this.setDisplayAreaRef}>
              {remainingOptions.map((option) => (
                <div className="status-option">{option}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default CustomDropdown;
