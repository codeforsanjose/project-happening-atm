import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'react-accessible-accordion';
import './AgendaView.scss';
import {
  useQuery, useMutation, ApolloClient, createHttpLink, InMemoryCache,
} from '@apollo/client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { setContext } from '@apollo/client/link/context';
import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../../utils/_icons';
import AgendaGroups from './AgendaGroups';
import Search from '../../Header/Search';
import MultipleSelectionBox from '../../MultipleSelectionBox/MultipleSelectionBox';
import MeetingItemStates from '../../../constants/MeetingItemStates';
import { RenderedAgendaItem } from './AgendaItem';
import { UPDATE_MEETING_ITEM, LOGIN_LOCAL } from '../../../graphql/graphql';

/**
 * Used to display a list of a meeting's agenda items and controls to
 * search and filter the items; Used in the MeetingView.
 *
 * props:
 *    meeting
 *      An object representing a meeting with an array of the agenda items
 *
 * state:
 *    showCompleted
 *      Boolean state to toggle if completed agenda items are shown
 *    selectedItems
 *      Agenda items selected by user. It is an object (has a dictionary structure) like
 *      {
 *        [meeting_id]: { [meeting_item_id]}
 *      }
 *    agendaGroups
 *      The meeting prop transformed into an array of objects.
 *  Each of these objects holds the information
 *      for the main container, and an array of items under the group
 *    activeId
 *      This represents the current agenda item or parent of the agenda items being moved
 *
 *
 *
 *
 */

const OPTIONS = {
  dropIdPostfix: 'Drop', // This is used to create a unique ID for the droppable containers within AgendaGroupBody
  oNumStart: 1, // default first number in order
};
let token;

function Login() {
  const { loading, error, data } = useQuery(LOGIN_LOCAL, {
    variables: {
      email_address: 'a@abc.com',
      password: '12345',
    },
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  console.log(data.loginLocal.token);
  token = data.loginLocal.token;
  window.localStorage.setItem('token', token);
  return (<input type="button" value={token} />);
}

const saveReOrder = (agendaGroups, updateMeetingItem) => {
  for (let parent = 0; parent < agendaGroups.length; parent += 1) {
    for (let child = 0; child < agendaGroups[parent].items.length; child += 1) {
      updateMeetingItem({
        variables: {
          id: agendaGroups[parent].items[child].id,
          order_number: agendaGroups[parent].items[child].order_number,
          status: agendaGroups[parent].items[child].status,
          content_categories: agendaGroups[parent].items[child].content_categories,
          item_start_timestamp: agendaGroups[parent].items[child].item_start_timestamp,
          description_loc_key: agendaGroups[parent].items[child].description_loc_key,
          title_loc_key: agendaGroups[parent].items[child].title_loc_key,
          parent_meeting_item_id: agendaGroups[parent].items[child].parent_meeting_item_id,
          item_end_timestamp: agendaGroups[parent].items[child].item_end_timestamp,

        },
      });
    }
  }
};

// This function is taking the meeting prop and organizing it into an array of objects.
// Each object acts as the parent of an agenda group and holds a items array of all agenda items
const groupMeetingItems = (allItems) => {
  const items = JSON.parse(JSON.stringify(allItems));
  const itemsWithNoParent = items.filter((item) => item.parent_meeting_item_id === null);
  const itemsWithParent = items.filter((item) => item.parent_meeting_item_id !== null);

  const agendaGroups = [];
  itemsWithNoParent.forEach((item, i) => {
    agendaGroups.push({ ...item });
    agendaGroups[i].items = [];
  });

  itemsWithParent.forEach((item) => {
    agendaGroups.forEach((parent) => {
      if (parent.id === item.parent_meeting_item_id) {
        parent.items.push(item);
      }
    });
  });

  // this is adding to each parent ID a unique ID to represent the dropable
  // container within each agenda group
  // necessary to allow moving agenda items into a empty container
  const agendaDropIDs = agendaGroups.map((parent) => parent.id + OPTIONS.dropIdPostfix);
  for (let i = 0; i < agendaGroups.length; i += 1) {
    agendaGroups[i].dropID = agendaDropIDs[i];
  }

  // ensure the agenda groups will render by order number
  agendaGroups.sort((a, b) => a.order_number - b.order_number);
  agendaGroups.forEach((group) => group.items.sort((a, b) => a.order_number - b.order_number));

  return agendaGroups;
};

// These are the event handlers for the DndContext

function AgendaView({ meeting }) {
  const { t } = useTranslation();
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [agendaGroups, setAgendaGroups] = useState(groupMeetingItems(meeting.items));
  const [activeId, setActiveId] = useState(null);
  const [oNumStart] = useState(agendaGroups.length > 0 ? agendaGroups[0].order_number : null);
  const [updateMeetingItem] = useMutation(UPDATE_MEETING_ITEM);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // This requies the user to click and hold to initiate a drag
      activationConstraint: {
        distance: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSelectionCancel = () => {
    setSelectedItems({});
  };

  const handleAgendaItemSelection = (meetingId, itemId, isChecked) => {
    if (isChecked && !(meetingId in selectedItems)) {
      selectedItems[meetingId] = {};
    }

    const selectedAgendaItems = selectedItems[meetingId];
    if (isChecked) {
      selectedAgendaItems[itemId] = isChecked;
    } else {
      delete selectedAgendaItems[itemId];
    }
    if (Object.keys(selectedAgendaItems).length === 0) {
      // There are no more selected items with meeting id equal to `meetingId`.
      // We delete the whole entry from `selectedItems` then.
      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[meetingId];
      setSelectedItems(newSelectedItems);
    } else {
      const newSelectedItems = { ...selectedItems, [meetingId]: selectedAgendaItems };
      setSelectedItems(newSelectedItems);
    }
  };

  // Necessary to ensure two agenda groups exist. One that is rendered,the other that holds the data
  function createRenderedGroups() {
    const newAgendaGroups = JSON.parse(JSON.stringify(agendaGroups));

    const uncompletedOnly = [];

    for (let i = 0; i < newAgendaGroups.length; i += 1) {
      if (newAgendaGroups[i].status !== MeetingItemStates.COMPLETED) {
        const group = newAgendaGroups[i];
        uncompletedOnly.push(group);
        const items = group.items.filter((item) => item.status !== MeetingItemStates.COMPLETED);
        newAgendaGroups[i].items = items;
      }
    }

    return (showCompleted ? newAgendaGroups : uncompletedOnly);
  }

  // These statements and variables below are necessary to ensure the dragOverlay functions

  let parentIds = 0;
  let activeIsParent = true; // ensure dragOverlay does not render when agendaGroup's empty
  let parentContainerIndex = 0;
  let activeitem = 0;

  // entered only when there are items to display
  if (agendaGroups.length > 0) {
    parentIds = agendaGroups.map((parent) => parent.id);
    activeIsParent = parentIds.filter((parent) => parent === activeId).length > 0;
    parentContainerIndex = 0;
    activeitem = { id: null };

    agendaGroups.forEach((parent, i) => {
      parent.items.forEach((item) => {
        if (item.id === activeId) {
          parentContainerIndex = i;
        }
      });
    });

    if (typeof parentContainerIndex !== 'undefined') {
      activeitem = agendaGroups[parentContainerIndex].items.find((item) => item.id === activeId);
    }
  }
  //

  // Necessary as the createRenderedGroups function returns renderedAgendaGroups
  // of which prevents the DND kit from moving items between completed and pending groups
  const displayAgenda = showCompleted ? agendaGroups : createRenderedGroups();

  // These are the event handlers for Dndcontext

  // called when the user starts dragging
  const handleDragStart = (event) => {
    const { active } = event;

    setActiveId(active.id);
  };

  // called when the user drags the dragOverlay on top of a agenda item or the group header
  // This function will handle the swapping of items between the agenda containers
  const handleDragOver = (event) => {
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

          // This makes sure the selected items are in the correct object containers
          setSelectedItems(() => {
            const deepCopy = JSON.parse(JSON.stringify(selectedItems));
            const activeContainerKey = String(newParents[activeContainerIndex].id);
            const overContainerKey = String(newParents[overContainerIndex].id);
            let needToSwap = false;

            const keyIsUndefined = typeof deepCopy[activeContainerKey] === 'undefined';

            if (!keyIsUndefined && deepCopy[activeContainerKey][active.id]) {
              needToSwap = true;
              delete deepCopy[activeContainerKey][active.id];
            }

            // entered only if a swap is needed
            if (needToSwap) {
              // entered when no object already assigned, prevents erasing previously checked items
              // in the agenda container that the dragged item is moving to
              if (!Object.prototype.hasOwnProperty.call(deepCopy, overContainerKey)) {
                deepCopy[newParents[overContainerIndex].id] = {};
              }
              deepCopy[newParents[overContainerIndex].id][active.id] = true;
            }

            return deepCopy;
          });

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

  // called when the user lets go of the dragged item
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // if statement only entered when the agendaitem is over a valid drop location
    if (over != null && active.id !== over.id) {
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

    // force the retrieval of the most recent agendaGroups, prevents the passing of stale data
    setAgendaGroups((parents) => {
      saveReOrder(parents, updateMeetingItem);

      return parents;
    });
  };

  return (
    <div className="AgendaView">
      <Login />
      <Search />

      <button
        type="button"
        className="complete-toggle"
        onClick={() => setShowCompleted((completed) => !completed)}
      >
        {showCompleted ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
        <p>{t('meeting.tabs.agenda.list.show-closed')}</p>
      </button>

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
          <AgendaGroups
            agendaGroups={displayAgenda}
            selectedItems={selectedItems}
            handleAgendaItemSelection={handleAgendaItemSelection}
          />
        </Accordion>

        <DragOverlay>

          {activeId && !activeIsParent ? (
            <RenderedAgendaItem
              id={activeId}
              item={activeitem}
              isSelected={selectedItems[agendaGroups[parentContainerIndex].id] !== undefined
            && selectedItems[agendaGroups[parentContainerIndex].id][activeitem.id] !== undefined}
              handleSelection={handleAgendaItemSelection}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      { Object.keys(selectedItems).length > 0
        && (
          <MultipleSelectionBox
            selectedItems={selectedItems}
            handleCancel={handleSelectionCancel}
          />
        )}
    </div>
  );
}

export default AgendaView;
