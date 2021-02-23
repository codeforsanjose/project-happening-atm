import React from 'react';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { SortableElement } from 'react-sortable-hoc';
import './AgendaItem.scss';

import AgendaSubItem from './AgendaSubItem';

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

const SortableAgendaSubItem = SortableElement(
  ({ renderedAgendaSubItem }) => <AgendaSubItem renderedAgendaSubItem={renderedAgendaSubItem} />,
);

export default function AgendaItem({ index, renderedAgendaItem }) {
  return (
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
        {renderedAgendaItem.subItems.map((renderedAgendaSubItem, i) => (
          <SortableAgendaSubItem
            index={i}
            collection={index}
            key={renderedAgendaSubItem+i}
            renderedAgendaSubItem={renderedAgendaSubItem}
          />
        ))}

      </AccordionItemPanel>
    </AccordionItem>
  );
}
