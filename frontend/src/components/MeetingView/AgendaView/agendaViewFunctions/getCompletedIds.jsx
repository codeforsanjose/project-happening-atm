import MeetingItemStates from '../../../../constants/MeetingItemStates';

const getCompletedIds = (agendaGroups) => {
  const completedIds = [];

  agendaGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (item.status === MeetingItemStates.COMPLETED) {
        completedIds.push(item.id);
      }
    });
  });

  return completedIds;
};

export default getCompletedIds;
