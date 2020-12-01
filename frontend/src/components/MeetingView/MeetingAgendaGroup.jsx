import React from 'react';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';
import './MeetingAgendaGroup.scss';

function MeetingAgendaGroup({ item }) {
  return (
    <AccordionItem className="MeetingAgendaGroup">
      <AccordionItemHeading className="group-header">
        <AccordionItemButton className="group-button">
          <div className="button-text">
            <div className="group-title">{item.title}</div>
            <div className="group-status">
              {item.status === 'Pending' ? '' : item.status}
            </div>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        <ul>
          {item.items.map((item,i) => <li key={i}>{item.title}</li>)}
        </ul>
      </AccordionItemPanel>
    </AccordionItem>
  )
}

export default MeetingAgendaGroup;