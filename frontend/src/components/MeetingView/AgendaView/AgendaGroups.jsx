import React from 'react';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import './AgendaGroup.scss';

import AgendaItem from './AgendaItem';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';


/**
 * A group of agenda items in a collapsible accordion.
 *
 * props:
 *    agendaGroup
 *      Object that represents an agenda group.
 *      {
 *        id: Number id of group
 *        title:  String title of group
 *        description:  String description of group
 *        status: String status of group
 *        items: An array of agenda group's sub items
 *      }
 *    selectedItems
 *      Agenda items selected by user. It is an object (has a dictionary structure) like
 *      {
 *        [meeting_id]: { [meeting_item_id]}
 *      }
 *    handleItemSelection
 *      A handler for agenda item selection
 */

function AgendaGroups({ agendaGroups, selectedItems, handleAgendaItemSelection }) {
  const parentItems = agendaGroups.map(parent=>parent.id);
  return (
    agendaGroups.map(parent=>{
      return(
        <AccordionItem className="AgendaGroup" key={parent.id + 'accord'}>
          <AgendaGroupHeader
            key={parent.id}
            agendaGroup={parent}
          />
          <AgendaGroupBody
            key={parent.id + 'agendaGroup'}
            agendaGroup={parent}
            selectedItems={selectedItems}
            handleItemSelection={handleAgendaItemSelection}
          />
        </AccordionItem>
      );
    })
  );
}

function AgendaGroupHeader({agendaGroup,selectedItems}){
  
  return (
    <AccordionItemHeading className="group-header">
          <AccordionItemButton className="group-button">
            <div className="button-text">
              <div className="group-title">{agendaGroup.title_loc_key}</div>
              <div className="group-status">
                {agendaGroup.status === MeetingItemStates.PENDING ? '' : agendaGroup.status}
              </div>
            </div>
          </AccordionItemButton>
    </AccordionItemHeading>
    

  );

}

function AgendaGroupBody({agendaGroup,selectedItems,handleItemSelection}){
  let agendaItemIds = agendaGroup.items.map(item=>item.id);
  console.log(agendaItemIds);
  return (
    <SortableContext
      items={agendaItemIds}
      strategy={verticalListSortingStrategy}
    >
      <AccordionItemPanel className="group-items">
            {agendaGroup.items.map((item) => (
              <AgendaItem
                key={item.id}
                item={item}
                isSelected={selectedItems[agendaGroup.id] !== undefined
                  && selectedItems[agendaGroup.id][item.id] !== undefined}
                handleSelection={handleItemSelection}
              />
            ))}
        </AccordionItemPanel>
    </SortableContext>
  );
}

export default AgendaGroups;
