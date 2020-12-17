import React from 'react';
import './MeetingItemListView.scss';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import MeetingItemStates from '../../constants/MeetingItemStates';
import useMeetingItemIcon from '../../hooks/useMeetingItemIcon';

function MeetingItemListView({
  title = '2.1 Approval of Unemployment Insurance Appropriation Ordinance Adjustments to Increase Payment of Claims and Access to Reserves',
  meetingItemState = MeetingItemStates.PENDING,
}) {
  const [stateClassName, icon, statusString] = useMeetingItemIcon(meetingItemState);
  return (
    <div className={classnames('meeting-item-list-view', stateClassName)}>
      <div className="row">
        {icon}

        <div className="details">
          <div className="title">
            {title}
          </div>
          <div className="status">
            { statusString }
          </div>
        </div>
      </div>
      <div className={classnames('meeting-actions')}>
        <Link className="button" to="/subscribe/1">
          <i className="fas fa-bell fa-lg" />
          <span>Subscribe</span>
        </Link>
        <button type="button" className="button">
          <i className="fas fa-share-alt fa-lg" />
          <span>Share</span>
        </button>
        <button type="button" className="button">
          <i className="fas fa-info-circle fa-lg" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}

export default MeetingItemListView
