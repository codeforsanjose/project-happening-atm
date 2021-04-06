import React, { useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
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
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
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
 * 
 * options:
 *    minHeightAgendaContainer
 *      This is the min height that the agenda group container must be. This is necessary to ensure 
 *      that an agenda item can be placed inside the container when the container is empty
 * 
 */
const options = {
  minHeightAgendaContainer:'60px'
};

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

//This is what makes the AgendaSubItem is sortable, in order to ensure the drag overlay worked correctly
const SortableItem = ({renderedAgendaSubItem, id }) => {
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
    <AgendaSubItem id={id} 
      renderedAgendaSubItem={renderedAgendaSubItem} 
      ref={setNodeRef} style={style} {...attributes}
      {...listeners}
    />
  );
}

//This is the rendered agenda item, renderedAgendaSubItem is only passed by SortableItem,
//id and renderedAgendaSubItems are passed by the drag overlay
const AgendaSubItem = forwardRef(({renderedAgendaSubItem, renderedAgendaSubItems, id, ...props}, ref) => {
   
  
  //This if statement is enetered if a single agenda item is passed to be rendered
  if(typeof renderedAgendaSubItem != 'undefined'){
    return buildAgendaItem(renderedAgendaSubItem);

  }else{//This else statement is entered when the drag overlay passes the ID and the items to be rendered array
    const parentItem = renderedAgendaSubItems.find(parent=>parent.subItems.find(subItem=>!subItem.id.localeCompare(id)));
    const agendaItem = parentItem.subItems.find(subItem=>!subItem.id.localeCompare(id));
    return buildAgendaItem(agendaItem);
  }

  //This function takes a agenda item and renders it
  function buildAgendaItem(renderedAgendaSubItem){
    return(
      <div {...props} ref={ref} className="AgendaItem">
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
    )
  }
});

//This function builds the agenda Groups, and their containers
const SortableAgendaSubItemContainer = 
  ({renderedAgendaItem }) => {

    const {setNodeRef} = useDroppable({
      id: renderedAgendaItem.id
    });

    //needed to ensure the dragable element can be placed when the container is empty
    const style={
      minHeight:options.minHeightAgendaContainer
    };
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
            {/*This extra div is needed to turn the agenda group into a dropable container,
             this is needed in the event the agenda group has no items */}
            <div style={style} ref={setNodeRef}>
              {renderedAgendaItem.subItems.map((renderedAgendaSubItem, index) =>{
                return (
                  <SortableItem 
                    id={renderedAgendaSubItem.id} 
                    renderedAgendaSubItem={renderedAgendaSubItem}
                    key={renderedAgendaSubItem.id}
                  />
                );})}
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
  );
};

//This handles all the sorting, it is the main outer container
const SortableAgendaItemContainer = ({items, setAgendaItems}) =>{
  //Active id will be assigned the ID of the agendaItem being moved my pointer
  const [activeId, setActiveId] = useState(null); 
  
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
    
  //The API has a delay in data request, need to account for the period that the array is empty
  if(items.length !== 0){
    
    return(
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}  sensors={sensors} collisionDetection={rectIntersection}>
        {items.map(item=>
          <SortableContext key={item.id} items={item.subItems.map(item=>item.id)} strategy={verticalListSortingStrategy} >
            <SortableAgendaSubItemContainer renderedAgendaItem={item} key={item.id}/>
          </SortableContext>)}
        
        <DragOverlay>
          {activeId ? <AgendaSubItem id={activeId} renderedAgendaSubItems={items} /> : null}
        </DragOverlay>
      </DndContext>      
    );
  }else{
    return(<div className='placeHolder'></div>);
  }

  //This function is called when the user lets go of their mouse and releases the agenda item
  function handleDragEnd(event){
    const {active, over} = event;
    
    //This if statement is entered only when the agenda item was released on top of another agenda item
    if (over != null && active.id !== over.id && over) {
      setAgendaItems((items) => {
        let newItems = JSON.parse(JSON.stringify(items));
      
        const parentIndex = newItems.findIndex(parent=>parent.subItems.find(item=>!item.id.localeCompare(active.id)));
        const oldIndex = newItems[parentIndex].subItems.findIndex(item=>!item.id.localeCompare(activeId));
        const newIndex = newItems[parentIndex].subItems.findIndex(item=>!item.id.localeCompare(over.id));

        newItems[parentIndex].subItems = arrayMove(items[parentIndex].subItems, oldIndex, newIndex);
        return newItems;
        
      });
    }
    setActiveId('null');
  }
  
  //This function is triggered when the currently dragged agenda item is moved
  //Its primary purpose is to handle the moving of an agenda item into another container
  function handleDragOver(event){
    const {active, over} = event;
    const regEx = /^\d+./; //This reg expression matches an agenda Item id, example 3.5

    //This first if statement fires only if the agenda item is over another agenda item or container
    if(over != null){
      //This if statement fires only if the dragged agenda item is over another agenda item
      if(regEx.test(over.id)){
        setAgendaItems((items)=>{
          let newItems = JSON.parse(JSON.stringify(items))

          const overParentId = newItems.find(parent=>parent.subItems.find(subItem=>subItem.id === over.id)).id;
          const activeParentId = newItems.find(parent=>parent.subItems.find(subItem=>subItem.id === active.id)).id;
          
          //This if statement is fired only when the agenda item is introduced to a new agenda group container
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
      }else{
        //This else branch will only fire if the agenda item is being dragged over a agenda group container
        //This should only happen when there is one agenda item, or none
        setAgendaItems((items)=>{
          
          let newItems = JSON.parse(JSON.stringify(items));                             
            
          const overParentIndex = items.findIndex(item=>!item.id.localeCompare(over.id));
          const activeParentIndex = newItems.findIndex(parent=>parent.subItems.find(item=>item.id === active.id));
          const oldIndex = newItems[activeParentIndex].subItems.findIndex(item=>item.id === active.id);

          const agendaItem = newItems[activeParentIndex].subItems.slice(oldIndex,oldIndex + 1)[0];
          newItems[activeParentIndex].subItems.splice(oldIndex,1);
          agendaItem.meetingId =over.id;
          newItems[overParentIndex].subItems.push(agendaItem);       
          
          return newItems;
        });
      }
    }
  }
  
  //only fired when the user begins dragging an agenda item
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

      <SortableAgendaItemContainer setAgendaItems={setAgendaItems} items={renderedAgendaItems}/>
    </div>
  );
}

export default AgendaView;
