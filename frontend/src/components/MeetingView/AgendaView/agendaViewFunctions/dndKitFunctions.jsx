import {
  arrayMove,
} from '@dnd-kit/sortable';
import StatusDontSort from '../../../../constants/StatusDontSort';

// This file will hold functions needed for the proper functioning of dnd kit with AgendaView.jsx

// utility function
const shouldItSort = (statusToCheck, itemToCheck) => {
  let dontSort = false;

  dontSort = statusToCheck.some(
    (elem) => elem === itemToCheck?.status,
  );

  return !dontSort;
};

// called when the user lets go of the dragged item
export const handleDragEnd = (event, { setAgendaGroups, oNumStart }) => {
  const { active, over } = event;

  // if statement only entered when the agendaitem is over a valid drop location
  if (over != null && active.id !== over.id) {
    setAgendaGroups((parents) => {
      const newParents = JSON.parse(JSON.stringify(parents));

      let parentIndex; // index of the agendaGroup currently hovered over
      let oldIndex; // The old index of the agendaItem being moved
      let newIndex; // The new index of the agendaItem being moved
      let sort = true;

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

      // Prevents dragging an unsortable item
      sort = shouldItSort(StatusDontSort.ITEMS_DONT_SORT, newParents[parentIndex].items[newIndex]);

      // prevents putting another item into the unsortable item
      if (sort) {
        sort = shouldItSort(StatusDontSort.ITEMS_DONT_SORT,
          newParents[parentIndex].items[oldIndex]);
      }

      // ensures that sorting only happens when moving items within a group
      if (sort) {
        sort = newParents[parentIndex].items.some((elem) => elem.id === over.id);
      }
      // prevents moving any items inside an unsortable group
      if (sort) {
        sort = shouldItSort(StatusDontSort.GROUP_DONT_SORT, newParents[parentIndex]);
      }

      if (sort) {
        newParents[parentIndex].items = arrayMove(parents[parentIndex].items, oldIndex, newIndex);
      }
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
      let sort = true;

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

      // prevents sorting into containers that are not sortable
      sort = shouldItSort(StatusDontSort.GROUP_DONT_SORT, newParents[overContainerIndex]);

      // prevent moving unsortable items between containers
      if (sort) {
        sort = shouldItSort(StatusDontSort.ITEMS_DONT_SORT,
          newParents[activeContainerIndex].items[activeIndex]);
      }

      // prevent moving items out of a unsortable container
      if (sort) {
        sort = shouldItSort(StatusDontSort.GROUP_DONT_SORT, newParents[activeContainerIndex]);
      }

      // entered when the dragOverlay has entered a new agenda group
      if (activeContainerIndex !== overContainerIndex && sort) {
        const overIsDropId = newParents.filter((parent) => parent.dropID === over.id).length > 0;
        // Moving a item to a group below it.
        const sortingFromAbove = activeContainerIndex < overContainerIndex;

        // entered when the dragOverlay is not on top of the header
        if (!overIsDropId) {
          const itemToMove = newParents[activeContainerIndex].items.splice(activeIndex, 1)[0];
          itemToMove.parent_meeting_item_id = newParents[overContainerIndex].id;
          // eslint-disable-next-line no-unused-expressions
          sortingFromAbove
            ? newParents[overContainerIndex].items.splice(overIndex, 0, itemToMove)
            : newParents[overContainerIndex].items.splice(overIndex + 1, 0, itemToMove);
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
export const handleDragStart = (event, { setActiveId, agendaGroups }) => {
  const { active } = event;
  let activeItem;
  let activeGroup;
  let sort = true;

  // need to find out which agendaGroups and items are sortable,
  // and then only set active those items that are sortable, and in a sortable container

  activeGroup = agendaGroups.filter((group) => group.items.some((item) => item.id === active.id));
  [activeGroup] = activeGroup;

  activeItem = activeGroup.items.filter((item) => item.id === active.id);
  [activeItem] = activeItem;

  if (sort) {
    sort = shouldItSort(StatusDontSort.GROUP_DONT_SORT, activeGroup);
  }
  if (sort) {
    sort = shouldItSort(StatusDontSort.ITEMS_DONT_SORT, activeItem);
  }

  if (sort) {
    setActiveId(active.id);
  } else {
    setActiveId(null);
  }
};
