import React, { useState } from 'react';
import { Accordion } from 'react-accessible-accordion';
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
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
const SortableAgendaGroupElement = SortableElement(
  ({ agendaGroup, index }) => <AgendaGroup key={index} index={index} agendaGroup={agendaGroup} />,
);
const SortableAgendaGroupContainer = SortableContainer(
  ({ renderedItems, onSubItemSortEnd }) => (
    <SortableSubItemContainer onSortEnd={onSubItemSortEnd}>
      {renderedItems.map((agendaGroup, index) => (
        <SortableAgendaGroupElement agendaGroup={agendaGroup} index={index} />
      ))}
    </SortableSubItemContainer>
  ),
);
const SortableSubItemContainer = SortableContainer(
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

  const onAgendaGroupSortEnd = ({ oldIndex, newIndex }) => {
    setAgendaItems(({ items }) => arrayMove(items, oldIndex, newIndex));
  };
  const onSubItemSortEnd = ({ oldIndex, newIndex, collection }) => {
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

      <SortableAgendaGroupContainer
        renderedItems={renderedItems}
        onSortEnd={onAgendaGroupSortEnd}
        onSubItemSortEnd={onSubItemSortEnd}
      />
    </div>
  );
}

export default AgendaView;
