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

import {useSortable} from '@dnd-kit/sortable';
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

function AgendaGroup({ agendaGroup, selectedItems, handleItemSelection }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: agendaGroup.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AccordionItem className="AgendaGroup">
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
      </AccordionItem>
    </div>
  );
}

export default AgendaGroup;
