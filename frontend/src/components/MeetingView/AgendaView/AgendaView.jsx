import React, { useState } from 'react';
import { Accordion } from 'react-accessible-accordion';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import './AgendaView.scss';

import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../../utils/_icons';
import AgendaItem from './AgendaItem';
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
const SortableAgendaItemElement = SortableElement(
  ({ renderedAgendaItem, index }) => <AgendaItem key={index} index={index} renderedAgendaItem={renderedAgendaItem} />,
);
const SortableAgendaItemContainer = SortableContainer(
  ({ renderedAgendaItems, onAgendaSubItemSortEnd }) => (
    <SortableAgendaSubItemContainer onSortEnd={onAgendaSubItemSortEnd}>
      {renderedAgendaItems.map((renderedAgendaItem, index) => (
        <SortableAgendaItemElement renderedAgendaItem={renderedAgendaItem} index={index} />
      ))}
    </SortableAgendaSubItemContainer>
  ),
);
const SortableAgendaSubItemContainer = SortableContainer(
  ({ children }) => (
    <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
      {children}
    </Accordion>
  ),
);
function AgendaView({ agendaItems, setAgendaItems }) {
  const [showCompleted, setShowCompleted] = useState(true);
  const renderedAgendaItems = showCompleted
    ? agendaItems
    : agendaItems.filter((item) => item.status !== 'Completed');

  const onAgendaItemSortEnd = ({ oldIndex, newIndex }) => {
    setAgendaItems(({ items }) => arrayMove(items, oldIndex, newIndex));
  };
  const onAgendaSubItemSortEnd = ({ oldIndex, newIndex, collection }) => {
    const newAgendaItems = [...agendaItems];
    newAgendaItems[collection].subItems = arrayMove(
      agendaItems[collection].subItems,
      oldIndex,
      newIndex,
    );
    setAgendaItems(newAgendaItems);
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

      <SortableAgendaItemContainer
        renderedAgendaItems={renderedAgendaItems}
        onSortEnd={onAgendaItemSortEnd}
        onAgendaSubItemSortEnd={onAgendaSubItemSortEnd}
      />
    </div>
  );
}

export default AgendaView;
