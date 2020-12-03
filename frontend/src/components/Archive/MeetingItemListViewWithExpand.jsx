import React, { useCallback, useMemo, useState } from 'react';
import './MeetingItemListView.scss';
import classnames from 'classnames';
import MeetingItemStates from '../../constants/MeetingItemStates';

function MeetingItemListView({ state = MeetingItemStates.IN_PROGRESS }) {
  const [stateClassName, icon] = useMemo(() => {
    const commonClassName = 'top-icon';
    switch (state) {
      case MeetingItemStates.COMPLETED: {
        return ['completed', <i className={classnames(commonClassName, 'fas', 'fa-check', 'fa-sm')} />];
      }
      case MeetingItemStates.IN_PROGRESS: {
        return ['in-progress',
          <>
            <i className={classnames(commonClassName, 'fas', 'fa-circle', 'fa-lg')} />
            <i className={classnames(`${commonClassName}-1`, 'fas', 'fa-circle', 'fa-lg')} />
            <i className={classnames(`${commonClassName}-2`, 'fas', 'fa-circle', 'fa-lg')} />
          </>,
        ];
      }
      case MeetingItemStates.MOVED: {
        return ['moved', <i className={classnames(commonClassName, 'fas', 'fa-exclamation', 'fa-sm')} />];
      }
      case MeetingItemStates.PENDING:
      default: {
        return ['pending', <i className={classnames(commonClassName, 'fas', 'fa-circle', 'fa-lg')} />];
      }
    }
  }, [state]);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpansionButtonOnClick = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded, setIsExpanded]);

  return (
    <div className={classnames('meeting-item-list-view', stateClassName, {
      'is-expanded': isExpanded,
    })}
    >
      <div className="row">
        <div className="icon">
          <i className="background-circle fas fa-circle fa-2x" />
          {icon}
        </div>

        <div className="details">
          <div className="title">
            2.1 Approval of Unemployment Insurance Appropriation Ordinance Adjustments to Increase Payment of Claims and Access to Reserves
          </div>
          <div className="status">
            In Progress
          </div>
        </div>
        <i
          className={classnames('fas', 'fa-lg', {
            'fa-times': isExpanded,
            'fa-plus': !isExpanded,
          })}
          onClick={toggleExpansionButtonOnClick}
        />
      </div>
      <div className={classnames('expanded-details', {
        hide: !isExpanded,
        show: isExpanded,
      })}
      >

        <button className="button">
          <i className="fas fa-bell fa-lg" />
          <span>Subscribe</span>
        </button>
        <button className="button">
          <i className="fas fa-share-alt fa-lg" />
          <span>Share</span>
        </button>
        <button className="button">
          <i className="fas fa-info-circle fa-lg" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

export default MeetingItemListView;
