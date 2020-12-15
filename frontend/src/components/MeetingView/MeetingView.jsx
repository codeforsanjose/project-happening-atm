import React, { useState } from 'react';
import {
  Accordion,
} from 'react-accessible-accordion';
import './MeetingView.scss';

import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../utils/_icons';
import MeetingAgendaGroup from './MeetingAgendaGroup';

function makeTestSubItem(parentIndex, index, status) {
  return {
    id: `${parentIndex}-${index}`,
    title: `${parentIndex}.${index} Agenda Item`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nisl euismod, tristique leo sit amet, eleifend enim.',
    status,
    items: [],
  };
}

function makeTestItem(index) {
  // eslint-disable-next-line no-nested-ternary
  const status = index <= 2 ? 'Completed' : index === 3 ? 'In Progress' : 'Pending';
  return {
    id: index,
    title: `${index} Agenda Group`,
    description: '',
    status,
    items: [1, 2, 3, 4].map((i) => makeTestSubItem(index, i, status)),
  };
}

const TEST_ITEMS = [1, 2, 3, 4, 5].map(makeTestItem);

function MeetingView() {
  const [items] = useState(TEST_ITEMS);
  const [showCompleted, setShowCompleted] = useState(true);

  const renderedItems = showCompleted
    ? items
    : items.filter((item) => item.status !== 'Completed');

  return (
    <div className="meeting-view">
      <div>
        <h3>Agenda</h3>
      </div>

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
          <MeetingAgendaGroup key={agendaGroup.id} agendaGroup={agendaGroup} />
        ))}
      </Accordion>
    </div>
  );
}

export default MeetingView;
