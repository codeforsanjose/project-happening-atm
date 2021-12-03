import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationLink.scss';

/**
 * Navigation button link component for the AdminNavigation component.
 *
 * props:
 *  Icon - SVG Icon component displayed on the button
 *  linkText - Text displayed on the button
 *  path - url path of the link
 */

function NavigationLink({ Icon, linkText, path }) {
  return (
    <li className="header-nav-link">
      <NavLink activeClassName="button-active" to={path}>
        <div className="button-group">
          <div className="button-group-inner">
            {Icon}
            <span className="button-text">{linkText}</span>
          </div>
        </div>
      </NavLink>
    </li>
  );
}

export default NavigationLink;
