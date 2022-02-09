import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'react-accessible-accordion';
import './AgendaView.scss';
import {
  useMutation,
  useQuery,
} from '@apollo/client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { getUserEmail, getUserPhone } from '../../../utils/verifyToken';
import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../../utils/_icons';

// components used by this component
import AgendaGroups from './AgendaGroups';

// functions used by this component
import { handleDragStart, handleDragOver, handleDragEnd } from './agendaViewFunctions/dndKitFunctions';
import groupMeetingItems from './agendaViewFunctions/groupMeetingItems';
import createRenderedGroups from './agendaViewFunctions/createRenderedGroups';
import saveReOrder from './agendaViewFunctions/saveReOrder';
import DragOverlayHandler from './DragOverlayHandlers/DragOverlayHandlers';
import isAdmin from '../../../utils/isAdmin';
import getProgressStatus from './agendaViewFunctions/getProgressStatus';
// graphql
import { UPDATE_MEETING_ITEM, GET_SUB_BY_EMAIL_MEETINGID } from '../../../graphql/graphql';

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
 *    agendaGroups
 *      The meeting prop transformed into an array of objects.
 *  Each of these objects holds the information
 *      for the main container, and an array of items under the group
 *    activeId
 *      This represents the current agenda item or parent of the agenda items being moved
 *    oNumStart
 *      This is the starting order-number, can be set in the const OPTIONS object
 *    isAdmin
 *      Flag to indicate user is admin or not
 *    updateMeetingItem
 *      Graphql mutation to save the new order after drag and dropping
 *
 */

const OPTIONS = {
  dropIdPostfix: 'Drop', // This is used to create a unique ID for the droppable containers within AgendaGroupBody
  oNumStart: 1, // This is the starting index of a group of item's order number
};

// These are the event handlers for the DndContext

function AgendaView({
  meeting, saveMeetingItems, setSaveMeetingItems, setMeetingItemsUpdated, setProgressStatus,
}) {
  const { t } = useTranslation();
  const [showCompleted, setShowCompleted] = useState(true);
  const [agendaGroups, setAgendaGroups] = useState(
    groupMeetingItems(meeting.items, OPTIONS.dropIdPostfix),
  );
  const [activeId, setActiveId] = useState(null);
  const [itemsUpdated, setItemsUpdated] = useState(0);
  const [itemsToUpdate, setItemsToUpdate] = useState(0);
  const [subbedItems, setSubbedItems] = useState([]);
  const [admin] = useState(isAdmin());
  const [expandedAcordians, setExpandedAcordians] = useState([]);
  const [updateMeetingItem] = useMutation(UPDATE_MEETING_ITEM,
    { onCompleted: () => { setItemsUpdated(itemsUpdated + 1); } });
  const { data, error, refetch } = useQuery(GET_SUB_BY_EMAIL_MEETINGID,
    {
      variables: {
        email_address: getUserEmail(),
        phone_number: getUserPhone(),
        meeting_id: agendaGroups.length > 0 ? agendaGroups[0].meeting_id : null,
      },
    });

  // sets the in progress flag for the wrapping component
  useEffect(
    () => {
      setProgressStatus(getProgressStatus(agendaGroups));
    }, [setProgressStatus, agendaGroups],
  );

  // performs the save when user clicks the button to save, then resets flag
  useEffect(
    () => {
      if (saveMeetingItems) {
        setSaveMeetingItems(false);
        saveReOrder(agendaGroups, meeting, updateMeetingItem, setItemsToUpdate);
      }
    }, [meeting, saveMeetingItems, agendaGroups,
      updateMeetingItem, setItemsToUpdate, setSaveMeetingItems],
  );

  // updates agendaGroups if the meeting data changes,
  // ensures changes made to order are displayed correctly
  useEffect(() => {
    setAgendaGroups(groupMeetingItems(meeting.items, OPTIONS.dropIdPostfix));
  }, [meeting]);

  // once all items have been sucessfully updated the parent component is notified thru the
  // meetingItemsUpdated flag and items updated reseted to 0
  useEffect(() => {
    if (itemsUpdated >= itemsToUpdate && itemsToUpdate > 0) {
      setMeetingItemsUpdated(true);
      setItemsUpdated(0);
      setItemsToUpdate(0);
    }
  }, [itemsUpdated, itemsToUpdate, setItemsToUpdate, setMeetingItemsUpdated]);

  // gets the subscription dataset
  useEffect(() => {
    if (data && !admin) {
      setSubbedItems(data.getSubscriptionsByEmailAndMeetingID);
    }
  }, [data, admin]);

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

  // These are the props for various functions, and components in object form
  // Event handler functions
  const onDragStartArgs = { setActiveId, agendaGroups };
  const onDragEndArgs = { setAgendaGroups, oNumStart: OPTIONS.oNumStart };
  const onDragOverArgs = { setAgendaGroups, agendaGroups };

  // DragOverlayhandler props
  const dragOverlayProps = {
    agendaGroups, activeId, subbedItems,
  };

  // Necessary as the createRenderedGroups function returns renderedAgendaGroups
  // of which prevents the DND kit from moving items between completed and pending groups
  const displayAgenda = showCompleted ? agendaGroups : createRenderedGroups(agendaGroups);

  return (
    <div className="AgendaView">

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
        collisionDetection={closestCorners}
        onDragStart={admin ? (e) => { handleDragStart(e, onDragStartArgs); } : null}
        onDragEnd={admin ? (e) => { handleDragEnd(e, onDragEndArgs); } : null}
        onDragOver={admin ? (e) => { handleDragOver(e, onDragOverArgs); } : null}
      >
        <Accordion allowZeroExpanded allowMultipleExpanded className="agenda" onChange={(expanded) => setExpandedAcordians(expanded)}>
          <AgendaGroups
            admin={admin}
            agendaGroups={displayAgenda}
            subbedItems={subbedItems}
            refetchSubs={refetch}
            expandedAcordians={expandedAcordians}
            getSubError={error}
          />
        </Accordion>

        {admin && activeId ? <DragOverlayHandler dragOverlayProps={dragOverlayProps} /> : null}
      </DndContext>
    </div>
  );
}

export default AgendaView;
