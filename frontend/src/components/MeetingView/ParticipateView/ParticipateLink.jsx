import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipateLink.scss';

import { ChevronRightIcon } from '../../../utils/_icons';

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
