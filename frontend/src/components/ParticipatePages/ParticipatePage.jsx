import React from 'react';
import './ParticipatePage.scss';

import BackNavigation from '../BackNavigation/BackNavigation';

function ParticipatePage({ Component }) {
  return (
    <div className="ParticipatePage">
      <BackNavigation />
      <Component />
    </div>
  )
}

export default ParticipatePage;