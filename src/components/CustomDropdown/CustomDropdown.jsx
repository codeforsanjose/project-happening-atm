import React, { Component } from 'react'
import './CustomDropdown.scss'

class CustomDropdown extends Component {
  state = {
    isOpen: this.props.isOpen,
  }
  componentDidMount() {
    //Assign click handler to listen the click to close the dropdown when clicked outside
    document.addEventListener('click', this.handleClickOutside)
  }
  toggleDropDown = () => {
    const { onChange } = this.props
    const { isOpen } = this.state
    this.setState({
      isOpen: !isOpen,
    })
    onChange && onChange(!isOpen)
  }
  //If click is outside the dropdown button or display area
  //Close the dropdown
  handleClickOutside = Event => {
    const path = Event.composedPath() //Gets the ancestor's hierarchy as an array
    const { onChange } = this.props
    if (
      !path.includes(this.displayAreaRef) &&
      !path.includes(this.dropTogglerRef)
    ) {
      this.setState({
        isOpen: false,
      })

      onChange && onChange(false)
    }
  }
  componentWillUnmount() {
    //Remove the listener
    document.removeEventListener('click', this.handleClickOutside)
  }
  render() {
    const { cellData, children, remainingOptions } = this.props
    const { isOpen } = this.state
    return (
      <div
        className="dropdown-wrapper"
        id={isOpen && 'dropdown-wrapper-active'}
      >
        <div
          className="current-status"
          onClick={this.toggleDropDown}
          ref={ref => (this.dropTogglerRef = ref)}
        >
          <span>{cellData}</span>
          <span className="arrow-icon">{isOpen ? '🔼' : '🔽'}</span>
        </div>
        <div className="remaining-options">
          {isOpen && (
            <div ref={ref => (this.displayAreaRef = ref)}>
              {remainingOptions.map(option => (
                <div className="status-option">{option}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}
export default CustomDropdown
