import React, { useState, useEffect } from 'react';
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

// components used by this component
import AgendaGroups from './AgendaGroups';
import Search from '../../Header/Search';
import MultipleSelectionBox from '../../MultipleSelectionBox/MultipleSelectionBox';

// functions used by this component
import { handleDragStart, handleDragOver, handleDragEnd } from './agendaViewFunctions/dndKitFunctions';
import groupMeetingItems from './agendaViewFunctions/groupMeetingItems';
import createRenderedGroups from './agendaViewFunctions/createRenderedGroups';
import saveReOrder from './agendaViewFunctions/saveReOrder';
import DragOverlayHandler from './DragOverlayHandlers/DragOverlayHandlers';
import getAdminStatus from '../../../utils/getAdminStatus';

// graphql
import { UPDATE_MEETING_ITEM } from '../../../graphql/graphql';

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
 *    oNumStart
 *      This is the starting order-number, it is set to the order-number value
 *      of the first parent element order number
 *    isAdmin
 *      Flag to indicate user is admin or not
 *    updateMeetingItem
 *      Graphql mutation to save the new order after drag and dropping
 *
 *
 *
 *
 */

const OPTIONS = {
  dropIdPostfix: 'Drop', // This is used to create a unique ID for the droppable containers within AgendaGroupBody
  oNumStart: 1,
};

// These are the event handlers for the DndContext

function AgendaView({ meeting, saveMeetingItems, setSaveMeetingItems }) {
  const { t } = useTranslation();
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [agendaGroups, setAgendaGroups] = useState(groupMeetingItems(meeting.items, OPTIONS));
  const [activeId, setActiveId] = useState(null);
  const [oNumStart] = useState(OPTIONS.oNumStart);
  const [isAdmin] = useState(getAdminStatus);
  const [updateMeetingItem] = useMutation(UPDATE_MEETING_ITEM);

  useEffect(
    () => {
      if (saveMeetingItems) {
        setSaveMeetingItems(false);
        saveReOrder(agendaGroups, updateMeetingItem);
      }
    },
  );
  // required for dndKit
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

  // These are the props for various functions, and components in object form
  // Event handler functions
  const onDragStartArgs = { setActiveId };
  const onDragEndArgs = { setAgendaGroups, oNumStart };
  const onDragOverArgs = { setAgendaGroups, setSelectedItems, selectedItems };

  // regular function props
  const createRenderGroupsArgs = { agendaGroups, showCompleted };

  // DragOverlayhandler props
  const dragOverlayProps = {
    agendaGroups, activeId, handleAgendaItemSelection, selectedItems,
  };

  // Necessary as the createRenderedGroups function returns renderedAgendaGroups
  // of which prevents the DND kit from moving items between completed and pending groups
  const displayAgenda = showCompleted ? agendaGroups : createRenderedGroups(createRenderGroupsArgs);

  return (
    <div className="AgendaView">

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
            handleCancel={() => setSelectedItems({})}
          />
        )}
    </div>
  );
}

export default AgendaView;
