import {
  arrayMove,
} from '@dnd-kit/sortable';

// This file will hold functions needed for the proper functioning of dnd kit with AgendaView.jsx

// called when the user lets go of the dragged item
export const handleDragEnd = (event, { setAgendaGroups, oNumStart, completedIds }) => {
  const { active, over } = event;
  const activeOrOverComplted = completedIds.some((id) => id === active.id || id === over.id);

  // if statement only entered when the agendaitem is over a valid drop location
  if (over != null && active.id !== over.id && !activeOrOverComplted) {
    setAgendaGroups((parents) => {
      const newParents = JSON.parse(JSON.stringify(parents));

      let parentIndex; // index of the agendaGroup currently hovered over
      let oldIndex; // The old index of the agendaItem being moved
      let newIndex; // The new index of the agendaItem being moved

      parents.forEach((parent, index) => {
        parent.items.forEach((item, itemIndex) => {
          if (item.id === active.id) {
            parentIndex = index;
            oldIndex = itemIndex;
          }

          if (item.id === over.id) {
            newIndex = itemIndex;
          }
        });
      });

      newParents[parentIndex].items = arrayMove(parents[parentIndex].items, oldIndex, newIndex);

      return newParents;
    });
  }

  // resort the agendaItems after a drop
  setAgendaGroups((parents) => {
    const newParents = JSON.parse(JSON.stringify(parents));

    for (let i = 0; i < newParents.length; i += 1) {
      for (let j = 0, oN = oNumStart; j < newParents[i].items.length; j += 1, oN += 1) {
        newParents[i].items[j].order_number = oN;
      }
    }

    return newParents;
  });
};

// called when the user drags the dragOverlay on top of a agenda item or the group header
// This function will handle the swapping of items between the agenda containers
export const handleDragOver = (event, { setAgendaGroups }) => {
  const { active, over } = event;

  setAgendaGroups((parents) => {
    console.log(parents);
    const newParents = JSON.parse(JSON.stringify(parents));

    // these are used in the conditional expressions
    let activeIsOver;
    let overIsContainer;
    let activeIsContainer;

    // assigns conditional expressions, has to be put in the if statement in the event the dragged
    // item is brought out of the draggable zone
    const overIsNull = over === null;
    if (!overIsNull) {
      activeIsOver = active.id === over.id;
      overIsContainer = parents.filter((parent) => parent.id === over.id).length > 0;
      activeIsContainer = parents.filter((parent) => parent.id === active.id).length > 0;
    }

    // item swapping is handled within
    if (!overIsNull && !activeIsOver && !overIsContainer && !activeIsContainer) {
      let activeContainerIndex;
      let overContainerIndex;
      let activeIndex;
      let overIndex;

      // finding the values of the variables above
      newParents.forEach((parent, parentIndex) => {
        parent.items.forEach((item, itemIndex) => {
          if (item.id === active.id) {
            activeIndex = itemIndex;
            activeContainerIndex = parentIndex;
          }
          if (item.id === over.id) {
            overIndex = itemIndex;
            overContainerIndex = parentIndex;
          }
        });
      });
      // entered when the dragOverlay has entered a new agenda group
      if (activeContainerIndex !== overContainerIndex) {
        const overIsDropId = newParents.filter((parent) => parent.dropID === over.id).length > 0;

        // entered when the dragOverlay is not on top of the header
        if (!overIsDropId) {
          const itemToMove = newParents[activeContainerIndex].items.splice(activeIndex, 1)[0];
          itemToMove.parent_meeting_item_id = newParents[overContainerIndex].id;
          newParents[overContainerIndex].items.splice(overIndex + 1, 0, itemToMove);
        } else { // entered when the overlay is on top of the header
          newParents.forEach((parent, i) => {
            if (parent.dropID === over.id) {
              overContainerIndex = i;
            }
          });

          const itemToMove = newParents[activeContainerIndex].items.splice(activeIndex, 1)[0];
          itemToMove.parent_meeting_item_id = newParents[overContainerIndex].id;
          newParents[overContainerIndex].items.push(itemToMove);
        }
      }
    }

    return newParents;
  });
};

// called when the user starts dragging
export const handleDragStart = (event, { setActiveId }) => {
  const { active } = event;

  setActiveId(active.id);
};
