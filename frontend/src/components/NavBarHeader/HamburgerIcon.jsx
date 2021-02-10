import React from 'react';
import './HamburgerIcon.scss';

function HamburgerIcon({ onClick, toggled }) {
  return (
    <div
      onClick={onClick}
      className={toggled ? 'burger burger-active' : 'burger'}
      onKeyDown={toggled ? 'burger burger-active' : 'burger'}
      role="button"
      tabIndex="0"
    >
      <div className="line-1" />
      <div className="line-2" />
      <div className="line-3" />
    </div>
  );
}

export default HamburgerIcon;
