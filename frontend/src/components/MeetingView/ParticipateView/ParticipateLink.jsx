import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipateLink.scss';

import { ChevronRightIcon } from '../../../utils/_icons';

/**
 * This is a link component that directs the user to a "Participate"
 * page; Used in the ParticipateView component.
 *
 * props:
 *    Icon
 *      A SVG icon component to be displayed in the link
 *    linkText
 *      A string value for the text displayed in the link
 *    path
 *      A string value for the path location of the link
 */

function ParticipateLink({ Icon, linkText, path }) {
  return (
    <div className="ParticipateLink">
      <Link to={path}>
        <div className="button-group">
          <Icon className="button-icon" />
          <span className="button-text">{linkText}</span>
          <ChevronRightIcon />
        </div>
      </Link>
    </div>
  );
}

export default ParticipateLink;
