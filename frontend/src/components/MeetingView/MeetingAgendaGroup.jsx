import React from 'react';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';
import './MeetingAgendaGroup.scss';

import MeetingAgendaItem from './MeetingAgendaItem';

function MeetingAgendaGroup({ agendaGroup }) {
  return (
    <AccordionItem className="MeetingAgendaGroup">
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
      <AccordionItemPanel>
        {agendaGroup.items.map((item,i) => <MeetingAgendaItem key={i} item={item} />)}
      </AccordionItemPanel>
    </AccordionItem>
  )
}

export default MeetingAgendaGroup;