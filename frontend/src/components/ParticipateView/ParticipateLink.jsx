import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipateLink.scss';

function ParticipateLink({ Icon, linkText, path }) {
  return (
    <div className="ParticipateLink">
      <Link activeClassName="button-active" to={path}>
        <div className="button-group">
          <div className="button-group-inner">
            <Icon className="button-icon" />
            <span className="button-text">{linkText}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ParticipateLink;
