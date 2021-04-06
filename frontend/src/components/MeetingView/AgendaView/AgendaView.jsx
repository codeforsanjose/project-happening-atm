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

const AgendaSubItem = forwardRef(({renderedAgendaSubItem, renderedAgendaSubItems, id, ...props}, ref) => {
   
  if(typeof renderedAgendaSubItem != 'undefined'){
    return buildAgendaItem(renderedAgendaSubItem);
  }else{
    const parentItem = renderedAgendaSubItems.find(parent=>parent.subItems.find(subItem=>!subItem.id.localeCompare(id)));
    const agendaItem = parentItem.subItems.find(subItem=>!subItem.id.localeCompare(id));
    return buildAgendaItem(agendaItem);
  }

  
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

const SortableAgendaSubItemContainer = 
  ({renderedAgendaItem }) => {

    const {setNodeRef} = useDroppable({
      id: renderedAgendaItem.id
    });

    //needed to ensure the dragable element can be placed
    const style={
      minHeight:'60px'
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

const SortableAgendaItemContainer = ({items, setAgendaItems}) =>{
  const [activeId, setActiveId] = useState('11');
  
 
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
    
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
  }

  return(<div className='placeHolder'></div>);

  function handleDragEnd(event){
    const {active, over} = event;
    
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

  function handleDragOver(event){
    const {active, over} = event;
    const regEx = /^\d$/;

    if(over != null){
      if(!regEx.test(over.id)){
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
      }else{
        setAgendaItems((items)=>{

          const overParentIndex = items.findIndex(item=>!item.id.localeCompare(over.id));
          let newItems = JSON.parse(JSON.stringify(items));
          if(items[overParentIndex].subItems.length === 0){            
            
            const activeParentIndex = newItems.findIndex(parent=>parent.subItems.find(item=>item.id === active.id));
            const oldIndex = newItems[activeParentIndex].subItems.findIndex(item=>item.id === active.id);

            const agendaItem = newItems[activeParentIndex].subItems.slice(oldIndex,oldIndex + 1)[0];
            newItems[activeParentIndex].subItems.splice(oldIndex,1);
            agendaItem.meetingId =over.id;
            newItems[overParentIndex].subItems.push(agendaItem);       
          }else{
            if((items[overParentIndex].subItems.length === 1)){
              
              const overParentId = over.id;                            
              const activeParentIndex = newItems.findIndex(parent=>parent.subItems.find(item=>item.id === active.id));
              const overParentIndex = newItems.findIndex(item=>item.id === over.id);
              const oldIndex = newItems[activeParentIndex].subItems.findIndex(item=>item.id === active.id);

              const agendaItem = newItems[activeParentIndex].subItems.slice(oldIndex,oldIndex + 1)[0];
              newItems[activeParentIndex].subItems.splice(oldIndex,1);
              agendaItem.meetingId =overParentId;
              newItems[overParentIndex].subItems.splice(0,0,agendaItem);    
            }   
          }
          return newItems;
        });
      }
    }
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

      <SortableAgendaItemContainer setAgendaItems={setAgendaItems} items={renderedAgendaItems}/>
    </div>
  );
}

export default AgendaView;
