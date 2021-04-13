/* eslint-disable react/jsx-props-no-spreading */
// Necessary as dnd sort uses prop spreading for its listeners and props
import React from 'react';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import './AgendaGroup.scss';

import {
  useDroppable,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MeetingItemStates from '../../../constants/MeetingItemStates';
import AgendaItem from './AgendaItem';

/**
 * A group of agenda items in a collapsible accordion.
 *
 * props:
 *    agendaGroups
 *      Object that represents an agenda group.
 *      {
 *        id: Number id of group
 *        title:  String title of group
 *        description:  String description of group
 *        status: String status of group
 *        items: An array of agenda group's sub items
 *      }
 *    selectedItems
 *      Agenda items selected by user. It is an object (has a dictionary structure) like
 *      {
 *        [meeting_id]: { [meeting_item_id]}
 *      }
 *    handleAgendaItemSelection
 *      A handler for agenda item selection
 *    dragOverlayActive
 *      Indicates an item is being dragged
 */

// Necessary to allow the dragging of an item into an empty group
const options = {
  minHeightAgendaContainer: '60px',
};

function AgendaGroups({
  agendaGroups, selectedItems, handleAgendaItemSelection, dragOverlayActive,
}) {
  const parentItems = agendaGroups.map((parent) => parent.id);

  // AgendaGroup was split into header and body to permit seperate dragging of the group and items.
  return (
    <SortableContext
      items={parentItems}
      strategy={verticalListSortingStrategy}
    >
      {agendaGroups.map((parent) => (
        <AccordionItem className="AgendaGroup" key={`${parent.id}accord`}>
          <AgendaGroupHeader
            key={parent.id}
            agendaGroup={parent}
          />
          <AgendaGroupBody
            key={`${parent.id}agendaGroup`}
            agendaGroup={parent}
            selectedItems={selectedItems}
            handleItemSelection={handleAgendaItemSelection}
            dragOverlayActive={dragOverlayActive}
          />
        </AccordionItem>
      ))}
    </SortableContext>
  );
}

function AgendaGroupHeader({ agendaGroup }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: agendaGroup.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AccordionItemHeading className="group-header">
        <AccordionItemButton className="group-button">
          <div className="button-text">
            <div className="group-title">{agendaGroup.title_loc_key}</div>
            <div className="group-status">
              {agendaGroup.status === MeetingItemStates.PENDING ? '' : agendaGroup.status}
            </div>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
    </div>

  );
}

function AgendaGroupBody({
  agendaGroup, selectedItems, handleItemSelection, dragOverlayActive,
}) {
  const { setNodeRef } = useDroppable({
    id: agendaGroup.dropID,
  });

  // needed to ensure the dragable element can be placed when the container is empty
  const style = {
    minHeight: options.minHeightAgendaContainer,
  };

  const agendaItemIds = agendaGroup.items.map((item) => item.id);

  return (
    <SortableContext
      items={agendaItemIds}
      strategy={verticalListSortingStrategy}
    >
      <AccordionItemPanel className="group-items">
        <div style={style} ref={setNodeRef}>
          {agendaGroup.items.map((item) => (
            <AgendaItem
              key={item.id}
              item={item}
              isSelected={selectedItems[agendaGroup.id] !== undefined
                  && selectedItems[agendaGroup.id][item.id] !== undefined}
              handleSelection={handleItemSelection}
              dragOverlayActive={dragOverlayActive}
            />
          ))}
        </div>
      </AccordionItemPanel>
    </SortableContext>
  );
}

export default AgendaGroups;
