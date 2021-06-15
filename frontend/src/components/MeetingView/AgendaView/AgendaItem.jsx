/* eslint-disable react/jsx-props-no-spreading */
// Necessary as dnd sort uses prop spreading for its listeners and props
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './AgendaItem.scss';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { buildSubscriptionQueryString } from '../../Subscribe/subscribeQueryString';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

const itemLinks = [
  {
    getPath: (item) => `/subscribe?${buildSubscriptionQueryString({ [item.meetingId]: { [item.id]: true } })}`,
    Icon: NotificationsIcon,
    text: 'Subscribe',
    isDisabled: (item) => item.status === MeetingItemStates.IN_PROGRESS
      || item.status === MeetingItemStates.COMPLETED,
  },
  {
    getPath: () => '/',
    Icon: ShareIcon,
    text: 'Share',
    isDisabled: () => false,
  },
  {
    getPath: () => '/',
    Icon: AddIcon,
    text: 'More Info',
    isDisabled: () => false,
  },
];

/**
 * An agenda group and accordion sub item
 *
 * props:
 *    item
 *      Object that represents an agenda item.
 *      {
 *        id: Number id of item
 *        meetingId: Number id of the corresponding meeting
 *        title:  String title of item
 *        description:  String description of item
 *        status: String status of item
 *      }
 *    isSelected
 *      A boolean value representing if this agenda item is selected (checked) by user
 *    handleSelection
 *      A handler for agenda item selection
 *    dragOverlayActive
 *      Indicates an item is being dragged
 */

/**
 * Important
 *
 *  RenderedAgendaItem is creating a overlay checkbox that renders on top of the component.
 *  Any changes that change the height of the component will cause the overlay checkbox to align
 *  The overlay checkbox can be adjusted in AgendaItem.scss
 *
 */

// The AgendaItem has to contain RenderedAgendaItem to ensure the drag overlay works correctly
function AgendaItem({ item, isSelected, handleSelection }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <RenderedAgendaItem
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      id={item.id}
      item={item}
      isSelected={isSelected}
      handleSelection={handleSelection}
    />
  );
}

function AgendaItemActionLink({ link }) {
  return (
    <div className="link">
      <link.Icon />
      <p>{link.text}</p>
    </div>
  );
}

const RenderedAgendaItem = forwardRef(({
  handleSelection, isSelected, item, id, ...props
}, ref) => {
  const handleCheck = (evt) => {
    if (evt.target) {
      handleSelection(item.parent_meeting_item_id, item.id, evt.target.checked);
    }
  };

  // The input within className='relativeEmptyContainer' is overlay on top of the actual checkbox.
  // This allows the smooth pressing of the checkbox and the ability to drag
  // Without this the dragOverlay prevented the pressing of the checkbox
  return (
    <div {...props} ref={ref} className="AgendaItem">
      {item.status !== MeetingItemStates.PENDING
          && <div className="item-status">{item.status}</div>}

      <div className="row">
        {item.status === MeetingItemStates.PENDING && <input type="checkbox" checked={isSelected} onChange={handleCheck} />}
        <h4>{item.title_loc_key}</h4>
      </div>
      <p>{item.description_loc_key}</p>
      <div className="item-links">
        {
            itemLinks.map((link) => {
              if (link.isDisabled(item)) {
                return (
                  <div className="disabled" key={`${item.id}link`}>
                    <AgendaItemActionLink link={link} />
                  </div>
                );
              }
              return (
                <Link to={link.getPath(item)} key={link.text}>
                  <AgendaItemActionLink link={link} />
                </Link>
              );
            })
          }
      </div>
    </div>
  );
});

// must export RenderedAgendaItem so that the dragOverlay can use it
export default AgendaItem;
export { RenderedAgendaItem };
