import React from 'react';

import {
  DragOverlay,
} from '@dnd-kit/core';

import { RenderedAgendaItem } from '../AgendaItem';

// This component will render the draggable overlay of the currently dragged item.
// In otherwords it creates a duplicate of the item being dragged for appearance purposes only.

function DragOverlayHandler(props) {
  // deconstructing all the props, had to disable deconstructing rule
  // so that I can deconstruct as an object
  const {
    agendaGroups, activeId, subbedItems,
    // eslint-disable-next-line react/destructuring-assignment
  } = props.dragOverlayProps;

  // Some local variables
  let parentContainerIndex = null; // The agendaGroup's parent container's index
  let activeItem = null; // The current agenda item being dragged

  // Need to get the parentContainer's index in agendaGroup
  agendaGroups.forEach((parent, i) => {
    parent.items.forEach((item) => {
      if (item.id === activeId) {
        parentContainerIndex = i;
      }
    });
  });
  // Need to get the activeItem itself and assign it, this is necessary
  // as the RenderAgendaItem needs its information to build a draggable overlay
  activeItem = agendaGroups[parentContainerIndex].items.find((item) => item.id === activeId);

  const RenderedAgendaItemArgs = {
    item: activeItem,
    dragOverlay: true,
  };
  return (
    <DragOverlay>
      <RenderedAgendaItem
        subStatus={
          subbedItems.some(
            (sub) => (sub.meeting_item_id === activeId),
          )
        }
        args={RenderedAgendaItemArgs}
      />
    </DragOverlay>
  );
}

export default DragOverlayHandler;
