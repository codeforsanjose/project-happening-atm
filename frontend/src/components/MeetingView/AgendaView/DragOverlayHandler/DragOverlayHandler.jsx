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
    agendaGroups, activeId, handleAgendaItemSelection, selectedItems,
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

  return (
    <DragOverlay>
      <RenderedAgendaItem
        id={activeId}
        item={activeItem}
        isSelected={selectedItems[agendaGroups[parentContainerIndex].id] !== undefined
        // disabling eslint below because length is 101, not going to rewrite for 1 extra character
                // eslint-disable-next-line max-len
                && selectedItems[agendaGroups[parentContainerIndex].id][activeItem.id] !== undefined}
        handleSelection={handleAgendaItemSelection}
      />
    </DragOverlay>
  );
}

export default DragOverlayHandler;
