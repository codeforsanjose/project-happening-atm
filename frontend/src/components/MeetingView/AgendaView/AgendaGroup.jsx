import React from 'react';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import './AgendaGroup.scss';

import AgendaItem from './AgendaItem';

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
 */

function AgendaGroup({ agendaGroup }) {
  return (
    <AccordionItem className="AgendaGroup">
      <AccordionItemHeading className="group-header">
        <AccordionItemButton className="group-button">
          <div className="button-text">
            <div className="group-title">{agendaGroup.title}</div>
            <div className="group-status">
              {agendaGroup.status === 'Pending' ? '' : agendaGroup.status}
            </div>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className="group-items">
        {agendaGroup.items.map((item) => <AgendaItem key={item.id} item={item} />)}
      </AccordionItemPanel>
    </AccordionItem>
  );
}

export default AgendaGroup;
