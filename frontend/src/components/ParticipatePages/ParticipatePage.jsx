import React from 'react';
import './ParticipatePage.scss';

import BackNavigation from '../BackNavigation/BackNavigation';

/**
 * A wrapper component for all pages in the Participate section.
 *
 * props:
 *    Component
 *      The component to render
*/

function ParticipatePage({ Component }) {
  return (
    <div className="ParticipatePage">
      <BackNavigation />
      <Component />
    </div>
  );
}

export default ParticipatePage;
