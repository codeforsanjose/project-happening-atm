import React from 'react';
import './AdminNavigationLink.scss';

/**
 * Navigation button link component for the AdminNavigation component.
 *
 * props:
 *  Icon - SVG Icon component displayed on the button
 *  linkText - Text displayed on the button
 *  handleClick - Callback function for the button
 *  active - Boolean to indicate if button is active
 */

function AdminNavigationLink({ Icon, linkText, handleClick, active }) {
  return (
    <li className="admin-nav-link">
      <button className={active ? "button-active" : ""} onClick={handleClick}>
        <div className="button-group">
          <div className="button-group-inner">
            <Icon className="button-icon" />
            <span className="button-text">{linkText}</span>
          </div>
        </div>
      </button>
    </li>
  );
}

export default AdminNavigationLink;