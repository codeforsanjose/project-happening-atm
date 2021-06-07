// This function is taking the meeting prop and organizing it into an array of objects.
// Each object acts as the parent of an agenda group and holds a items array of all agenda items
const groupMeetingItems = (allItems, OPTIONS) => {
  const items = JSON.parse(JSON.stringify(allItems));
  const itemsWithNoParent = items.filter((item) => item.parent_meeting_item_id === null);
  const itemsWithParent = items.filter((item) => item.parent_meeting_item_id !== null);

  const agendaGroups = [];
  itemsWithNoParent.forEach((item, i) => {
    agendaGroups.push({ ...item });
    agendaGroups[i].items = [];
  });

  itemsWithParent.forEach((item) => {
    agendaGroups.forEach((parent) => {
      if (parent.id === item.parent_meeting_item_id) {
        parent.items.push(item);
      }
    });
  });

  // this is adding to each parent ID a unique ID to represent the dropable
  // container within each agenda group
  // necessary to allow moving agenda items into a empty container
  const agendaDropIDs = agendaGroups.map((parent) => parent.id + OPTIONS.dropIdPostfix);
  for (let i = 0; i < agendaGroups.length; i += 1) {
    agendaGroups[i].dropID = agendaDropIDs[i];
  }

  // ensure the agenda groups will render by order number
  agendaGroups.sort((a, b) => a.order_number - b.order_number);
  agendaGroups.forEach((group) => group.items.sort((a, b) => a.order_number - b.order_number));

  return agendaGroups;
};

export default groupMeetingItems;
