import React, { useState } from 'react';
import { Accordion } from 'react-accessible-accordion';
import './AgendaView.scss';

import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../../utils/_icons';
import AgendaGroup from './AgendaGroup';

function AgendaView({ agendaItems }) {
  const [showCompleted, setShowCompleted] = useState(true);

  const renderedItems = showCompleted
    ? agendaItems
    : agendaItems.filter((item) => item.status !== 'Completed');

  return (
    <div className="AgendaView">
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
