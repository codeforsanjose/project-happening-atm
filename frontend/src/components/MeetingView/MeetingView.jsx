import React, { useState, useEffect } from 'react';
import {
  Accordion,
} from 'react-accessible-accordion';
import './MeetingView.scss';

import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../utils/_icons';
import MeetingAgendaGroup from './MeetingAgendaGroup';
import NavBarHeader from '../NavBarHeader/NavBarHeader';
import Header from '../Header/Header';

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

/**
 * Component that displays a list of a meeting's agenda items.
 * Utilizes react-accessible-accordion to display groups of items.
 *
 * state:
 *    items
 *      An array of the current meeting's agenda items
 *    showCompleted
 *      Boolean state to toggle if completed agenda items are shown
 */

function MeetingView() {
  const [items, setItems] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [toggled, setToggled] = useState(false);

  function handleToggle() {
    setToggled(!toggled);
  }

  useEffect(() => {
    async function fetchAgendaItems() {
      // TODO: https://github.com/codeforsanjose/gov-agenda-notifier/issues/88
      setTimeout(() => setItems(TEST_ITEMS), 2000); // MOCK API CALL
    }
    fetchAgendaItems();
  }, []);

  const renderedItems = showCompleted
    ? items
    : items.filter((item) => item.status !== 'Completed');

  return (
    <div className="meeting-view">
      <NavBarHeader toggled={toggled} handleToggle={handleToggle} />
      <Header />

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
