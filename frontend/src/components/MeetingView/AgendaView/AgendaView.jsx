import React, { useState } from 'react';
import { Accordion } from 'react-accessible-accordion';
import './AgendaView.scss';

import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../../utils/_icons';
import AgendaGroup from './AgendaGroup';
import Search from '../../Header/Search';

/**
 * Used to display a list of a meeting's agenda items and controls to
 * search and filter the items; Used in the MeetingView.
 *
 * props:
 *    agendaItems
 *      An array of the current meeting's agenda items
 *
 * state:
 *    showCompleted
 *      Boolean state to toggle if completed agenda items are shown
 */

function AgendaView({ agendaItems }) {
  const [showCompleted, setShowCompleted] = useState(true);

  const renderedItems = showCompleted
    ? agendaItems
    : agendaItems.filter((item) => item.status !== 'Completed');

  return (
    <div className="AgendaView">
      <Search />

      <button
        type="button"
        className="complete-toggle"
        onClick={() => setShowCompleted((completed) => !completed)}
      >
        {showCompleted ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
        <p>Show Completed Items</p>
      </button>

      <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
        {renderedItems.map((agendaGroup) => (
          <AgendaGroup key={agendaGroup.id} agendaGroup={agendaGroup} />
        ))}
      </Accordion>
    </div>
  );
}

export default AgendaView;
