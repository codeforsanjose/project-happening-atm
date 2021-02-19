import React, { useState } from 'react';
import { Accordion } from 'react-accessible-accordion';
import { arrayMove, SortableContainer } from 'react-sortable-hoc';
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
const SortableList = SortableContainer(
  ({ children }) => (
    <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
      {children}
    </Accordion>
  ),
);
function AgendaView({ agendaItems, setAgendaItems }) {
  const [showCompleted, setShowCompleted] = useState(true);
  const renderedItems = showCompleted
    ? agendaItems
    : agendaItems.filter((item) => item.status !== 'Completed');

  const onSortEnd = ({ oldIndex, newIndex, collection }) => {
    const newCollections = [...agendaItems];
    newCollections[collection].items = arrayMove(
      agendaItems[collection].items,
      oldIndex,
      newIndex,
    );
    setAgendaItems(newCollections);
  };

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

      <SortableList onSortEnd={onSortEnd}>
        {renderedItems.map((agendaGroup, index) => (
          <AgendaGroup key={index} index={index} agendaGroup={agendaGroup} />
        ))}
      </SortableList>
    </div>
  );
}

export default AgendaView;
