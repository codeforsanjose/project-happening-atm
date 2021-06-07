import MeetingItemStates from '../../../../constants/MeetingItemStates';

// Necessary to ensure two agenda groups exist. One that is rendered,the other that holds the data
const createRenderedGroups = ({ agendaGroups, showCompleted }) => {
  const newAgendaGroups = JSON.parse(JSON.stringify(agendaGroups));

  const uncompletedOnly = [];

  for (let i = 0; i < newAgendaGroups.length; i += 1) {
    if (newAgendaGroups[i].status !== MeetingItemStates.COMPLETED) {
      const group = newAgendaGroups[i];
      uncompletedOnly.push(group);
      const items = group.items.filter((item) => item.status !== MeetingItemStates.COMPLETED);
      newAgendaGroups[i].items = items;
    }
  }

  return (showCompleted ? newAgendaGroups : uncompletedOnly);
};

export default createRenderedGroups;
