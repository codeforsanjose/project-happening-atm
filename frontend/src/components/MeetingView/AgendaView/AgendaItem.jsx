import React, {forwardRef} from 'react';
import { Link } from 'react-router-dom';
import './AgendaItem.scss';
import { buildSubscriptionQueryString } from '../../Subscribe/subscribeQueryString';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

import {
  useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
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
 */

function AgendaItem({id, item, isSelected, handleSelection, dragOverlayActive }) {
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
    <RenderedAgendaItem {...attributes}
    {...listeners} ref={setNodeRef} style={style} id={id} item={item} dragOverlayActive={dragOverlayActive} isSelected={isSelected} handleSelection={handleSelection}/>
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

const RenderedAgendaItem = forwardRef(({dragOverlayActive, flag, handleSelection,isSelected,item,id, ...props}, ref) =>{
  
  const handleCheck = (evt) => {
    if (evt.target && typeof handleSelection != 'undefined') {
      handleSelection(item.parent_meeting_item_id, item.id, evt.target.checked);
    }
  };
  let classWhenDragging;
  let classNotDragging;

  if(item.status !== MeetingItemStates.PENDING){
    classWhenDragging= "hideCheckBox";
    classNotDragging= "completeOvrLaidChkBx";
  }else{
    classWhenDragging = "hideCheckBox";
    classNotDragging = "overlaidCheckBox";
  }
  
  return (
    <div>
      <div className='relativeEmptyContainer'>
        <input type="checkbox" className={dragOverlayActive ? classWhenDragging : classNotDragging} checked={isSelected} onChange={handleCheck} />
      </div>
      <div {...props} ref={ref} className="AgendaItem" >
        {item.status !== MeetingItemStates.PENDING
          && <div className="item-status">{item.status}</div>}
        
        <div className="row">
          <input type="checkbox" checked={isSelected} onChange={handleCheck} />
          <h4>{item.title_loc_key}</h4>
        </div>
        <p>{item.description_loc_key}</p>
        
        <div className="item-links">
          {
            itemLinks.map((link) => {
              if (link.isDisabled(item)) {
                return (
                  <div className="disabled" key={item.id + "link"}>
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
    </div>
  );
});

export default AgendaItem;
export {RenderedAgendaItem};