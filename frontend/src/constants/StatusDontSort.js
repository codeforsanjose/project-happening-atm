// These are the status that will not be sorted, or be able to move on the UI

import MeetingItemStates from './MeetingItemStates';

const StatusDontSort = {
  ITEMS_DONT_SORT: [MeetingItemStates.COMPLETED, MeetingItemStates.IN_PROGRESS],
  GROUP_DONT_SORT: [MeetingItemStates.COMPLETED],
};

export default StatusDontSort;
