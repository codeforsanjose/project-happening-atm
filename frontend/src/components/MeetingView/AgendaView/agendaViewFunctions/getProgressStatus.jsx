import MeetingItemStates from '../../../../constants/MeetingItemStates';

// This function returns true if an agenda item is in progress for this meeting
const getProgressStatus = (agendaGroups) => {
  let progressStatus = false;
  agendaGroups.forEach((group) => {
    const inProgress = group.items.some((item) => item.status === MeetingItemStates.IN_PROGRESS);
    if (inProgress) {
      progressStatus = true;
    }
  });
  return progressStatus;
};

export default getProgressStatus;
