import React, { useMemo } from 'react';
import classnames from 'classnames';
import MeetingItemStates from '../constants/MeetingItemStates';
import './MeetingItemIcon.scss';

const useMeetingItemIcon = ({ meetingItemState }) => {
  const [stateClassName, icon, statusString] = useMemo(() => {
    const commonClassName = 'top-icon';
    let classname;
    let icons;
    let statusStrings;

    switch (meetingItemState) {
      case MeetingItemStates.COMPLETED: {
        classname = 'completed';
        icons = <i className={classnames(commonClassName, 'fas', 'fa-check', 'fa-sm')} />;
        statusStrings = 'Completed';
        break;
      }
      case MeetingItemStates.IN_PROGRESS: {
        classname = 'in-progress';
        icons = (
          <>
            <i className={classnames(commonClassName, 'fas', 'fa-circle', 'fa-lg')} />
            <i className={classnames(`${commonClassName}-1`, 'fas', 'fa-circle', 'fa-lg')} />
            <i className={classnames(`${commonClassName}-2`, 'fas', 'fa-circle', 'fa-lg')} />
          </>
        );
        statusStrings = 'In Progress';
        break;
      }
      case MeetingItemStates.MOVED: {
        classname = 'moved';
        icons = <i className={classnames(commonClassName, 'fas', 'fa-exclamation', 'fa-sm')} />;
        statusStrings = 'Rescheduled';
        break;
      }
      case MeetingItemStates.PENDING:
      default: {
        classname = 'pending';
        icons = <i className={classnames(commonClassName, 'fas', 'fa-circle', 'fa-lg')} />;
        statusStrings = 'Pending';
        break;
      }
    }

    return [
      classname,
      <div className={classnames('meeting-item-icon', classname)}>
        <i className="background-circle fas fa-circle fa-2x" />
        {icons}
      </div>,
      statusStrings,
    ];
  }, [meetingItemState]);

  return [stateClassName, icon, statusString];
};

export default useMeetingItemIcon;
