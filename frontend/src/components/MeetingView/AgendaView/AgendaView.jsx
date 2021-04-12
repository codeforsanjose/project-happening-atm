import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'react-accessible-accordion';
import './AgendaView.scss';

import { CheckedCheckboxIcon, UncheckedCheckboxIcon } from '../../../utils/_icons';
import AgendaGroups from './AgendaGroups';
import Search from '../../Header/Search';
import MultipleSelectionBox from '../../MultipleSelectionBox/MultipleSelectionBox';
import MeetingItemStates from '../../../constants/MeetingItemStates';
import {RenderedAgendaItem} from './AgendaItem';

import {
  DndContext, 
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection
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
 *    agendaGroups
 *      The meeting prop transformed into an array of objects. Each of these objects holds the information
 *      for the main container, and an array of items under the group
 *    activeId
 *      This represents the current agenda item or parent of the agenda items being moved
 *    dragOverlayActive
 *      This is used to track when the dragOverlay for DND kit is being rendered. 
 *      Its purpose is to control the display of a input check box that is acting as a overlay
 *      ontop of the component. This was necessary as drag overlay would not allow the clicking of the
 *      check mark.
 *      
 *  
 *      
 *    
 */
  
const OPTIONS = {
  dropIdPostfix:'Drop' //This is used to create a unique ID for the droppable containers within AgendaGroupBody
};

function AgendaView({ meeting }) {
  const { t } = useTranslation();
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [agendaGroups, setAgendaGroups] = useState(groupMeetingItems);
  const [activeId, setActiveId] = useState(null);
  const [dragOverlayActive, setDragOverlayActive] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  //This function is taking the meeting prop and organizing it into an array of objects.
  //Each object acts as the parent of an agenda group and holds a items array of all agenda items
  function groupMeetingItems(){
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

    //this is adding to each parent ID a unique ID to represent the dropable container within each agenda group
    //necessary to allow moving agenda items into a empty container
    agendaGroups.forEach(parent=>parent.dropID = parent.id + OPTIONS.dropIdPostfix);
    
    return agendaGroups;
  };

  //Necessary to ensure two agenda groups exist. One that is rendered, the other that holds the data
  function createRenderedGroups(agendaGroups){
    let newAgendaGroups = JSON.parse(JSON.stringify(agendaGroups));
    
    let uncompletedOnly = [];
    newAgendaGroups.forEach(parent=>{
      if(parent.status !== MeetingItemStates.COMPLETED){
        uncompletedOnly.push(parent);
        parent.items = parent.items.filter(item=>item.status !== MeetingItemStates.COMPLETED);
      }
    });
    
    return (showCompleted ? newAgendaGroups : uncompletedOnly);
  }



  //These statements and variables below are necessary to ensure the dragOverlay functions correctly

  let parentIds = 0;
  let activeIsParent = true;   //needed to ensure dragOverlay does not render when agendaGroup is empty
  let parentContainerIndex = 0;
  let activeitem = 0;

  //entered only when there are items to display
  if(agendaGroups.length > 0){

    parentIds = agendaGroups.map(parent=>parent.id);
    activeIsParent = parentIds.filter(parent=> parent === activeId).length > 0;
    parentContainerIndex = 0;
    activeitem = {id:null};

    agendaGroups.forEach((parent,i)=>{
      parent.items.forEach(item=>{
        if(item.id === activeId){
          parentContainerIndex = i;
        }
      })
    });
    
    if(typeof parentContainerIndex != 'undefined'){
      activeitem = agendaGroups[parentContainerIndex].items.find(item=>item.id === activeId);
    }
  }
  //

  //Necessary as the createRenderedGroups function returns renderedAgendaGroups of which prevents the DND kit from
  //moving items between completed and pending groups
  const displayAgenda = showCompleted ? agendaGroups : createRenderedGroups(agendaGroups);
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragMove={handleDragMove}
      >
        <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
          <AgendaGroups agendaGroups={displayAgenda} dragOverlayActive={dragOverlayActive}
            selectedItems={selectedItems} handleAgendaItemSelection={handleAgendaItemSelection} 
          />
        </Accordion>

        <DragOverlay>
          
          {!activeIsParent ? <RenderedAgendaItem id={activeId} item={activeitem} 
            isSelected={selectedItems[agendaGroups[parentContainerIndex].id] !== undefined
            && selectedItems[agendaGroups[parentContainerIndex].id][activeitem.id] !== undefined}
            handleSelection={handleAgendaItemSelection} dragOverlayActive={dragOverlayActive}
            /> : null}
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

  //called when the user starts dragging
  function handleDragStart(event) {
    const {active} = event;
  
    setActiveId(active.id);
  }

  //called when the user is moving the dragOverlay
  //This is used to hide the checkbox overlaid on top of the components
  function handleDragMove(){
    setDragOverlayActive(true);
  }

  //called when the user drags the dragOverlay on top of a agenda item or the group header
  //This function will handle the swapping of items between the agenda containers
  function handleDragOver(event){
    const {active, over} = event;
    
    setAgendaGroups((parents)=>{
      let newParents = JSON.parse(JSON.stringify(parents));
      
      //these are used in the conditional expressions
      let activeIsOver
      let overIsContainer
      let activeIsContainer

      //assigns the conditional expressions, has to be put in the if statement in  the event the dragged
      //item is brought out of the draggable zone
      let overIsNull = over === null;
      if(!overIsNull){
        activeIsOver = active.id === over.id;
        overIsContainer = parents.filter(parent=>parent.id === over.id).length > 0;
        activeIsContainer = parents.filter(parent=>parent.id === active.id).length > 0;
      }
      
      //item swapping is handled within
      if(!overIsNull && !activeIsOver && !overIsContainer && !activeIsContainer){

        let activeContainerIndex;
        let overContainerIndex;
        let activeIndex;
        let overIndex;

        //finding the values of the variables above
        newParents.forEach((parent,parentIndex)=>{
          parent.items.forEach((item,itemIndex)=>{
            if(item.id === active.id){
              activeIndex = itemIndex;
              activeContainerIndex = parentIndex;
            }
            if(item.id === over.id){
              overIndex = itemIndex;
              overContainerIndex = parentIndex;
            }
          })
        })
        //entered when the dragOverlay has entered a new agenda group
        if(activeContainerIndex !== overContainerIndex){
          const overIsDropId = newParents.filter(parent=>parent.dropID === over.id).length > 0;
          
          //This makes sure the selected items are in the correct object containers
          setSelectedItems((selectedItems)=>{
            let deepCopy = JSON.parse(JSON.stringify(selectedItems));   
            let needToSwap = false;

            for(let property in deepCopy){
              if(deepCopy[property][active.id]){
                needToSwap = true;
              }
              delete deepCopy[property][active.id];
            }

            //entered only if a swap is needed
            if(needToSwap){

              //entered only when no object is already asigned, prevents erasing previously checked items
              //in the agenda container that the dragged item is moving to
              if(!deepCopy.hasOwnProperty(newParents[overContainerIndex].id)){
                deepCopy[newParents[overContainerIndex].id] = {};
              }
              deepCopy[newParents[overContainerIndex].id][active.id] = true;         
            }

            return deepCopy;
          })

          //entered when the dragOverlay is not on top of the header
          if(!overIsDropId){
            let itemToMove = newParents[activeContainerIndex].items.splice(activeIndex,1)[0];
            itemToMove.parent_meeting_item_id = newParents[overContainerIndex].id;
            newParents[overContainerIndex].items.splice(overIndex+1,0,itemToMove);

          }else{//entered when the overlay is on top of the header
            newParents.forEach((parent,i)=>{
              if(parent.dropID === over.id){
                overContainerIndex = i;
              }
            });

            let itemToMove = newParents[activeContainerIndex].items.splice(activeIndex,1)[0];
            itemToMove.parent_meeting_item_id = newParents[overContainerIndex].id;
            newParents[overContainerIndex].items.push(itemToMove);
          }
        }
      }

      return newParents;
    });
    
  }

  //called when the user lets go of the dragged item
  function handleDragEnd(event) {
    const {active, over} = event;
    console.log(event);
    console.log(agendaGroups);
    if (over != null && active.id !== over.id) {
      
      //If statement only entered when moving the main agenda containers
      if(agendaGroups.filter(parent=>parent.id === active.id).length > 0){
        parentAgendaOnly(active,over);
      }else{
        movingItems(active,over);
      }
    }
    


    function movingItems(active,over){
      setAgendaGroups((parents) => {
        let newParents = JSON.parse(JSON.stringify(parents));

        let overIsContainer = newParents.filter(parent=>parent.id === over.id).length > 0;
        
        if(!overIsContainer){
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
        }
        return newParents;
        
      });
    }
    
    function parentAgendaOnly(active,over){
      setAgendaGroups((parents) => {
        
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
    //This lets the checkmark overlay become visible again
    setDragOverlayActive(false);
  }
  
}

export default AgendaView;
