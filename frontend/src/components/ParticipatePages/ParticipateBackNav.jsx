import React from 'react';
import { Link } from 'react-router-dom';
import './ParticipateBackNav.scss';

import { ChevronLeftIcon } from '../../utils/_icons';

function ParticipateBackNav() {
  return (
    <div className="ParticipateBackNav">
      <Link to="/" className="back">
        <ChevronLeftIcon />
        <p>Back</p>
      </Link>
    </div>
  );
}

export default ParticipateBackNav;
