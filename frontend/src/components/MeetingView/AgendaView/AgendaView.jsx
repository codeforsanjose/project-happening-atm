import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import './AgendaView.scss';
import './AgendaItem.scss';
import './AgendaSubItem.scss';
import {
  CheckedCheckboxIcon,
  UncheckedCheckboxIcon,
  NotificationsIcon,
  ShareIcon,
  AddIcon,
} from '../../../utils/_icons';
import Search from '../../Header/Search';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

/**
 * Used to display a list of a meeting's agenda items and controls to
 * search and filter the items; Used in the MeetingView.
 *
 * props:
 *    agendaItems
 *      An array of the current meeting's agenda items
 *
 * state:
 *    showCompleted
 *      Boolean state to toggle if completed agenda items are shown
 */

const agendaSubItemLinks = [
  {
    getPath: (item) => `/subscribe/${item.meetingId}/${item.id}`,
    Icon: NotificationsIcon,
    text: 'Subscribe',
  },
  {
    getPath: (item) => '/',
    Icon: ShareIcon,
    text: 'Share',
  },
  {
    getPath: (item) => '/',
    Icon: AddIcon,
    text: 'More Info',
  },
];

function AgendaSubItem({renderedAgendaSubItem, id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: id});
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
 
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="AgendaItem">
      {renderedAgendaSubItem.status !== 'Pending' && <div className="item-status">{renderedAgendaSubItem.status}</div>}

      <input type="checkbox" />
      <h4>{renderedAgendaSubItem.title}</h4>
      <p>{renderedAgendaSubItem.description}</p>

      <div className="item-links">
        {
          agendaSubItemLinks.map((link) => (
            <Link to={link.getPath(renderedAgendaSubItem)} key={link.text}>
              <div className="link">
                <link.Icon />
                <p>{link.text}</p>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}

const PatrickSortableAgendaSubItemContainer = 
  ({renderedAgendaItem }) => {
    

    return(
      <Accordion allowZeroExpanded allowMultipleExpanded className="agenda">
        <AccordionItem className="AgendaGroup">
          <AccordionItemHeading className="group-header">
            <AccordionItemButton className="group-button">
              <div className="button-text">
                <div className="group-title">{renderedAgendaItem.title}</div>
                <div className="group-status">
                  {renderedAgendaItem.status === 'Pending' ? '' : renderedAgendaItem.status}
                </div>
              </div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className="group-items">
            {renderedAgendaItem.subItems.map((renderedAgendaSubItem, index) =>{
              return (
                <AgendaSubItem 
                  id={renderedAgendaSubItem.id} 
                  renderedAgendaSubItem={renderedAgendaSubItem}
                  key={renderedAgendaSubItem.id}
                />
              );})}

          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
  );
};

const PatrickSortableAgendaItemContainer = ({items, setAgendaItems}) =>{
  const [activeId, setActiveId] = useState('11');
  
 
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
    
  if(items.length != 0){
    
    return(
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}  sensors={sensors} collisionDetection={closestCenter}>
        {items.map(item=>
          <SortableContext key={item.id} items={item.subItems.map(item=>item.id)} strategy={verticalListSortingStrategy} >
            <PatrickSortableAgendaSubItemContainer renderedAgendaItem={item} key={item.id}/>
          </SortableContext>)}
        
        {/* <DragOverlay>
          {activeId ? (<Temp id={activeId} /> ): null}
        </DragOverlay> */}
      </DndContext>      
    );
  }

  return(<div className='placeHolder'></div>);

  function handleDragEnd(event){
    const {active, over} = event;
   
    if (active.id !== over.id) {
      setAgendaItems((items) => {
        let newItems = JSON.parse(JSON.stringify(items));
      
        const parentIndex = newItems.findIndex(parent=>parent.subItems.find(item=>item.id === active.id));
        const oldIndex = newItems[parentIndex].subItems.findIndex(item=>item.id === active.id);
        const newIndex = newItems[parentIndex].subItems.findIndex(item=>item.id === over.id);

        newItems[parentIndex].subItems = arrayMove(items[parentIndex].subItems, oldIndex, newIndex);
        return newItems;
        
      });
    }
    setActiveId('null');
  }

  function handleDragOver(event){
    const {active, over} = event;
    
    setAgendaItems((items)=>{
      let newItems = JSON.parse(JSON.stringify(items))

      const overParentId = newItems.find(parent=>parent.subItems.find(subItem=>subItem.id === over.id)).id;
      const activeParentId = newItems.find(parent=>parent.subItems.find(subItem=>subItem.id === active.id)).id;
      
      if(overParentId.localeCompare(activeParentId)){
        const activeParentIndex = newItems.findIndex(parent=>parent.subItems.find(item=>item.id === active.id));
        const overParentIndex = newItems.findIndex(parent=>parent.subItems.find(item=>item.id === over.id));
        const oldIndex = newItems[activeParentIndex].subItems.findIndex(item=>item.id === active.id);

        const agendaItem = newItems[activeParentIndex].subItems.slice(oldIndex,oldIndex + 1)[0];
        newItems[activeParentIndex].subItems.splice(oldIndex,1);
        agendaItem.meetingId =overParentId;
        newItems[overParentIndex].subItems.splice(0,0,agendaItem);
      }
      
      return newItems;
    });
    
  }
  
  function handleDragStart(event) {
    setActiveId(event.active.id);
    
  }
};
function AgendaView({ agendaItems, setAgendaItems }) {
  const [showCompleted, setShowCompleted] = useState(true);
  
  const renderedAgendaItems = showCompleted
    ? agendaItems
    : agendaItems.filter((item) => item.status !== 'Completed');
  
  return (
    <div className="AgendaView">
      <Search />

      <button
        type="button"
        className="complete-toggle"
        onClick={() => setShowCompleted((completed) => !completed)}
      >
        {showCompleted ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
        <p>Show Completed Items</p>
      </button>

      <PatrickSortableAgendaItemContainer setAgendaItems={setAgendaItems} items={renderedAgendaItems}/>
    </div>
  );
}

export default AgendaView;
