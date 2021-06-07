import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'react-accessible-accordion';
import './AgendaView.scss';
import {
  useMutation,
} from '@apollo/client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../../utils/_icons';
import AgendaGroups from './AgendaGroups';
import Search from '../../Header/Search';
import MultipleSelectionBox from '../../MultipleSelectionBox/MultipleSelectionBox';
import MeetingItemStates from '../../../constants/MeetingItemStates';
import { UPDATE_MEETING_ITEM } from '../../../graphql/graphql';
import { handleDragStart, handleDragOver, handleDragEnd } from './agendaViewFunctions/dndKitFunctions';
import DragOverlayHandler from './DragOverlayHandler/DragOverlayHandler';
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

// returns the curent user role
const getRole = () => {
  const token = localStorage.getItem('token');
  return JSON.parse(atob(token.split('.')[1])).roles[0] === 'ADMIN';
};

// These are the event handlers for the DndContext

function AgendaView({ meeting }) {
  const { t } = useTranslation();
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [agendaGroups, setAgendaGroups] = useState(groupMeetingItems(meeting.items));
  const [activeId, setActiveId] = useState(null);
  const [oNumStart] = useState(agendaGroups.length > 0 ? agendaGroups[0].order_number : null);
  const [isAdmin] = useState(getRole);
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

  // saves the new rendering
  const saveReOrder = () => {
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

  // Necessary as the createRenderedGroups function returns renderedAgendaGroups
  // of which prevents the DND kit from moving items between completed and pending groups
  const displayAgenda = showCompleted ? agendaGroups : createRenderedGroups();

  // These are the props for various functions, and components in object form
  // Event handler functions
  const onDragStartArgs = { setActiveId };
  const onDragEndArgs = { setAgendaGroups, oNumStart };
  const onDragOverArgs = { setAgendaGroups, setSelectedItems, selectedItems };

  // DragOverlayhandler props
  const dragOverlayProps = {
    agendaGroups, activeId, handleAgendaItemSelection, selectedItems,
  };

  return (
    <div className="AgendaView">
      {isAdmin ? <button className="saveOrder" type="button" onClick={saveReOrder}>Save Order</button> : ''}

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
        onDragStart={isAdmin ? (e) => { handleDragStart(e, onDragStartArgs); } : null}
        onDragEnd={isAdmin ? (e) => { handleDragEnd(e, onDragEndArgs); } : null}
        onDragOver={isAdmin ? (e) => { handleDragOver(e, onDragOverArgs); } : null}
      >
        <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
          <AgendaGroups
            isAdmin={isAdmin}
            agendaGroups={displayAgenda}
            selectedItems={selectedItems}
            handleAgendaItemSelection={handleAgendaItemSelection}
          />
        </Accordion>

        {isAdmin && activeId ? <DragOverlayHandler dragOverlayProps={dragOverlayProps} /> : null}
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
