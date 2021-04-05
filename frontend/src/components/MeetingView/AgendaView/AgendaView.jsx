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

function Temp({id }) {
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
    <p ref={setNodeRef} style={style} {...attributes} {...listeners}>THIS IS A TEST</p>
  )
}

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

const SortableAgendaSubItemElement = SortableElement(
  ({ renderedAgendaSubItem }) => 
    <AgendaSubItem renderedAgendaSubItem={renderedAgendaSubItem} />
);

const SortableAgendaSubItemContainer = SortableContainer(
  ({ parentIndex, renderedAgendaItem }) => (
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
          {renderedAgendaItem.subItems.map((renderedAgendaSubItem, index) => (
            <SortableAgendaSubItemElement
              index={index}
              collection={parentIndex}
              // eslint-disable-next-line react/no-array-index-key
              key={renderedAgendaSubItem + index}
              renderedAgendaSubItem={renderedAgendaSubItem}
            />
          ))}

        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  ),
);

const SortableAgendaItemElement = SortableElement(
  ({ renderedAgendaItem, parentIndex, onAgendaSubItemSortEnd }) => (
    <SortableAgendaSubItemContainer
      parentIndex={parentIndex}
      onSortEnd={onAgendaSubItemSortEnd}
      renderedAgendaItem={renderedAgendaItem}
    />
  ),
);

const SortableAgendaItemContainer = SortableContainer(
  ({ renderedAgendaItems, onAgendaSubItemSortEnd }) => (
    renderedAgendaItems.map((renderedAgendaItem, index) => (
      <SortableAgendaItemElement
        renderedAgendaItem={renderedAgendaItem}
        index={index}
        parentIndex={index}
        onAgendaSubItemSortEnd={onAgendaSubItemSortEnd}
      />
    ))
  ),
);

const PatrickSortableAgendaSubItemContainer = 
  ({renderedAgendaItem }) => {
    
    console.log(renderedAgendaItem);
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
              console.log(renderedAgendaSubItem.id);

              return (
              <PatrickSortableAgendaSubItemElement
                index={index}
                id={renderedAgendaSubItem.id}
                key={renderedAgendaSubItem + index}
                renderedAgendaSubItem={renderedAgendaSubItem}
                
              />
            );})}

          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
  );
};

const PatrickSortableAgendaSubItemElement = 
  ({ renderedAgendaSubItem, id }) => (
    <AgendaSubItem id={id} renderedAgendaSubItem={renderedAgendaSubItem} />
  );

const PatrickSortableAgendaItemContainer = ({items}) =>{
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
    
  if(items.length != 0){
    const items2 = items[0].subItems.map(item=>item.id);
    console.log(items[0].subItems.find(item=>item.id === '1'));
    console.log(activeId);

    return(
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}  sensors={sensors} collisionDetection={closestCenter}>
        <SortableContext items={items2} strategy={verticalListSortingStrategy}>
          <PatrickSortableAgendaSubItemContainer renderedAgendaItem={items[0]} />
        </SortableContext>

        {/* <DragOverlay>
          {activeId ? (<Temp id={activeId} /> ): null}
        </DragOverlay> */}
      </DndContext>      
    );
  }

  return(<p>test</p>);

  function handleDragStart(event) {
    setActiveId(event.active.id);
    console.log(activeId);
  }

  function handleDragEnd(){
    setActiveId(null);
    console.log(activeId);
  }
};

function AgendaView({ agendaItems, setAgendaItems }) {
  const [showCompleted, setShowCompleted] = useState(true);
  const renderedAgendaItems = showCompleted
    ? agendaItems
    : agendaItems.filter((item) => item.status !== 'Completed');

  const onAgendaSubItemSortEnd = ({ oldIndex, newIndex, collection }) => {
    const newAgendaItems = [...agendaItems];
    newAgendaItems[collection].subItems = arrayMove(
      agendaItems[collection].subItems,
      oldIndex,
      newIndex,
    );
    setAgendaItems(newAgendaItems);
  };
  const onAgendaItemSortEnd = ({ oldIndex, newIndex }) => {
    const newAgendaItems = arrayMove(agendaItems, oldIndex, newIndex);
    setAgendaItems(newAgendaItems);
  };
  
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

      {/* <SortableAgendaItemContainer
        renderedAgendaItems={renderedAgendaItems}
        onSortEnd={onAgendaItemSortEnd}
        onAgendaSubItemSortEnd={onAgendaSubItemSortEnd}
      /> */}
      
      <PatrickSortableAgendaItemContainer items={renderedAgendaItems}/>
      
    </div>
  );
}

export default AgendaView;
