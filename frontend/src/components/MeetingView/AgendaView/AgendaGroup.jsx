import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import './AgendaGroup.scss';

import AgendaItem from './AgendaItem';
import MeetingItemStates from '../../../constants/MeetingItemStates';

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
  const { t } = useTranslation();

  return (
    <AccordionItem className="AgendaGroup">
      <AccordionItemHeading className="group-header">
        <AccordionItemButton className="group-button">
          <div className="button-text">
            <div className="group-title">{t(agendaGroup.title_loc_key)}</div>
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
  );
}

export default AgendaGroup;
