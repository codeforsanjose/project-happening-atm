import React from 'react';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import './MeetingListGroup.scss';

// Component imports
import MeetingListItem from './MeetingListItem';

/**
 * A group of meeting items grouped by date in a collapsible accordion.
 *
 * props:
 *    month
 *      String month displayed on group accordion button
 *    year
 *      String year displayed on group acordion button
 *    meetings
 *      Array of meeting items belonging to the group
 *    uuid
 *      Number used to determine which group is pre-expanded
 */

function MeetingListGroup({
  month, year, meetings, uuid,
}) {
  return (
    <AccordionItem className="MeetingListGroup" uuid={uuid}>
      <AccordionItemHeading className="group-header">
        <AccordionItemButton className="group-button">
          <div className="button-text">
            <div className="group-main-text">{month}</div>
            <div className="group-sub-text">{year}</div>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className="group-items">
        {meetings.map((item) => <MeetingListItem key={item.id} item={item} />)}
      </AccordionItemPanel>
    </AccordionItem>
  );
}

export default MeetingListGroup;
