import React from 'react';
import './MeetingItem.scss';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import MeetingItemStates from '../../constants/MeetingItemStates';
import { useMeetingItemIcon } from '../../hooks/useMeetingItemIcon';

function MeetingItem({
  title = '2.1 Approval of Unemployment Insurance Appropriation Ordinance Adjustments to Increase Payment of Claims and Access to Reserves',
  meetingItemState = MeetingItemStates.PENDING,
}) {
  const [stateClassName, icon, statusString] = useMeetingItemIcon(meetingItemState);

  return (
    <div className={classnames('meeting-item-view', stateClassName)}>
      <div className="row">
        {icon}
        <div className="status">
          {statusString}
        </div>
        <Link to="/">
          <i className={classnames('fas', 'fa-lg', 'fa-times')} />
        </Link>
      </div>
      <h1>Agenda Item Details</h1>
      <p className="title">{title}</p>
      <br />
      <h1>Recommendation</h1>
      <p className="recommendation">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Viverra maecenas accumsan lacus vel facilisis volutpat est velit. In dictum non consectetur a erat. Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis.
      </p>
      <div className="button-row">
        <button className="button">Resource Link</button>
        <button className="button">Resource Link</button>
      </div>
    </div>
  );
}

export default MeetingItem;
