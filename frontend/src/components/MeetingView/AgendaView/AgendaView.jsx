import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'react-accessible-accordion';
import './AgendaView.scss';

import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../../utils/_icons';
import AgendaGroups from './AgendaGroups';
import Search from '../../Header/Search';
import MultipleSelectionBox from '../../MultipleSelectionBox/MultipleSelectionBox';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';

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
 */

function AgendaView({ meeting }) {
  const { t } = useTranslation();
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [agendaGroups, setAgendaGroups] = useState(groupMeetingItems)
  const [renderedAgendaGroups, setRenderedAgendaGroups] = useState(createRenderedGroups);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSelectionCancel = () => {
    setSelectedItems({});
  };
  console.log(renderedAgendaGroups);

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

  //rewritten to make the agendaGroups into an array, and not an object of holding arrays
  function groupMeetingItems(){
    // Groups all the meeting items by `parent_meeting_item_id`.
    // Returns a hash table with keys as agenda items id (the ones without `parent_meeting_item_id`)
    // and values as the items themselves. Inside such items there can be a property `items` which
    // is an array of agenda items whose `parent_meeting_item_id` is equal to the corresponding key.
    console.log('groupMeetingItems RAN');
    
    let items = JSON.parse(JSON.stringify(meeting.items));
    const itemsWithNoParent = items.filter((item) => item.parent_meeting_item_id === null);
    const itemsWithParent = items.filter((item) => item.parent_meeting_item_id !== null);

    let agendaGroups =[];
    itemsWithNoParent.forEach((item,i) => {
      agendaGroups.push({ ...item });
      agendaGroups[i].items = [];
    });

    itemsWithParent.forEach(item=>{
      agendaGroups.forEach((parent,i)=>{
        if(parent.id === item.parent_meeting_item_id){
          parent.items.push(item);
        }
      })
    });
    
    //agendaGroups = createRenderedGroups(agendaGroups);
    return agendaGroups;
  };

  //needed to create two distinct groups of agendas. One for rendering and one for directly moving items
  function createRenderedGroups(){
    setShowCompleted((completed) => !completed)
    
    let uncompletedOnly = [];
    agendaGroups.forEach(parent=>{
      if(parent.status != MeetingItemStates.COMPLETED){
        uncompletedOnly.push(parent);
        parent.items = parent.items.filter(item=>item.status !== MeetingItemStates.COMPLETED);
      }
    });
    
    return showCompleted ? agendaGroups : uncompletedOnly;
    
    setRenderedAgendaGroups(showCompleted ? agendaGroups : uncompletedOnly);
  }

  //needed to create two distinct groups of agendas. One for rendering and one for directly moving items
  function createRenderedGroups2(){
    setShowCompleted((completed) => !completed)
    
    let uncompletedOnly = [];
    agendaGroups.forEach(parent=>{
      if(parent.status != MeetingItemStates.COMPLETED){
        uncompletedOnly.push(parent);
        parent.items = parent.items.filter(item=>item.status !== MeetingItemStates.COMPLETED);
      }
    });
  
    setRenderedAgendaGroups(showCompleted ? agendaGroups : uncompletedOnly);
  }

  
  const parentItems = renderedAgendaGroups.map(parent=>parent.id);
  
  
  return (
    <div className="AgendaView">
      <Search />

      <button
        type="button"
        className="complete-toggle"
        onClick={createRenderedGroups2}
      >
        {showCompleted ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
        <p>{t('meeting.tabs.agenda.list.show-closed')}</p>
      </button>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
          <AgendaGroups agendaGroups={renderedAgendaGroups} 
            selectedItems={selectedItems} handleAgendaItemSelection={handleAgendaItemSelection} 
          />
        </Accordion>
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

  function handleDragStart(event) {
    const {active} = event;
    
    setActiveId(active.id);
  }
  //This function will handle the swapping of items between the agenda containers
  function handleDragOver(event){
    const {active, over} = event;
    console.log('inside handle drag');
    setRenderedAgendaGroups((parents)=>{
      let newParents = JSON.parse(JSON.stringify(parents));

      let activeContainerIndex;
      let overContainerIndex;
      let activeIndex;
      let overIndex;

      let activeIsOver = active.id === over.id;
      console.log(activeIsOver);
      if(!activeIsOver){

        for(let i = 0; i < newParents.length;i++){
          newParents[i].items.forEach((item,itemIndex)=>{
            if(item.id === active.id){
              activeIndex = itemIndex;
              activeContainerIndex = i;
            }
            if(item.id === over.id){
              overIndex = itemIndex;
              overContainerIndex = i;
            }
          });
        }

        if(activeContainerIndex != overContainerIndex){
          let itemToMove = newParents[activeContainerIndex].items.splice(activeIndex,1)[0];
          itemToMove.parent_meeting_item_id = newParents[overContainerIndex].id;
          newParents[overContainerIndex].items.splice(overIndex+1,0,itemToMove);
          console.log(newParents);
          console.log(itemToMove);
        }
      }

      return newParents;
    });
    
  }

  
  function handleDragEnd(event) {
    const {active, over} = event;
    
    if (over != null && active.id !== over.id) {
      
      //If statement only entered when moving the main agenda containers
      if(renderedAgendaGroups.filter(parent=>parent.id === active.id).length > 0){
        parentAgendaOnly(active,over);
      }else{
        movingItems(active,over);
      }
    }
    


    function movingItems(active,over){
      setRenderedAgendaGroups((parents) => {
        let newParents = JSON.parse(JSON.stringify(parents));
        console.log(newParents);
        let parentIndex;
        let oldIndex;
        let newIndex;

        parents.forEach((parent, index)=>{
          parent.items.forEach((item, itemIndex)=>{
            if(item.id === active.id){
              parentIndex = index;
              oldIndex = itemIndex;
            }
            
            if(item.id === over.id){
              newIndex = itemIndex;
            }
          })
        });
        
        newParents[parentIndex].items = arrayMove(parents[parentIndex].items, oldIndex, newIndex);
        return newParents;
      });
    }
    
    function parentAgendaOnly(active,over){
      setRenderedAgendaGroups((parents) => {
        
        let oldIndex;
        let newIndex;

        parents.forEach((parent, index)=>{
          if(parent.id === active.id){
            oldIndex = index;
          }
          if(parent.id === over.id){
            newIndex = index;
          }
        });
          
        return arrayMove(parents, oldIndex, newIndex);
      });
    }

  }
  
}

export default AgendaView;
