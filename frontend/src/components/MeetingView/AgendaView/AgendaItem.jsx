import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './AgendaItem.scss';
import { buildSubscriptionQueryString } from '../../Subscribe/subscribeQueryString';
import MeetingItemStates from '../../../constants/MeetingItemStates';

import { NotificationsIcon, ShareIcon, AddIcon } from '../../../utils/_icons';

const itemLinks = [
  {
    getPath: (item) => `/subscribe?${buildSubscriptionQueryString({ [item.meetingId]: { [item.id]: true } })}`,
    Icon: NotificationsIcon,
    text: 'Subscribe',
  },
  {
    getPath: () => '/',
    Icon: ShareIcon,
    text: 'Share',
  },
  {
    getPath: () => '/',
    Icon: AddIcon,
    text: 'More Info',
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

function AgendaItem({ item, isSelected, handleSelection }) {
  const { t } = useTranslation();

  const handleCheck = (evt) => {
    if (evt.target) {
      handleSelection(item.parent_meeting_item_id, item.id, evt.target.checked);
    }
  };

  return (
    <div className="AgendaItem">
      {item.status !== MeetingItemStates.PENDING
        && <div className="item-status">{item.status}</div>}

      <input type="checkbox" checked={isSelected} onChange={handleCheck} />
      <h4>{t(item.title_loc_key)}</h4>
      <p>{t(item.description_loc_key)}</p>

      <div className="item-links">
        {
          itemLinks.map((link) => (
            <Link to={link.getPath(item)} key={link.text}>
              <div className="link">
                <link.Icon />
                <p>{link.text}</p>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export default AgendaItem;
