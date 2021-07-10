// saves the new rendering, and also saves the number of items saved
const saveReOrder = (agendaGroups, meeting, updateMeetingItem, setItemsToUpdate) => {
  const { items } = meeting;

  for (let parent = 0; parent < agendaGroups.length; parent += 1) {
    for (let child = 0; child < agendaGroups[parent].items.length; child += 1) {
      items.forEach((element) => {
        if (element.id === agendaGroups[parent].items[child].id) {
          const elementParentId = element.parent_meeting_item_id;
          const agendaGroupParentId = agendaGroups[parent].items[child].parent_meeting_item_id;
          const elementOrderN = element.order_number;
          const agendaGroupOrderNumber = agendaGroups[parent].items[child].order_number;
          if (elementParentId !== agendaGroupParentId || elementOrderN !== agendaGroupOrderNumber) {
            setItemsToUpdate((n) => n + 1);
            updateMeetingItem({
              variables: {
                id: agendaGroups[parent].items[child].id,
                order_number: agendaGroups[parent].items[child].order_number,
                status: agendaGroups[parent].items[child].status,
                content_categories: agendaGroups[parent].items[child].content_categories,
                item_start_timestamp: agendaGroups[parent].items[child].item_start_timestamp,
                description_loc_key: agendaGroups[parent].items[child].description_loc_key,
                title_loc_key: agendaGroups[parent].items[child].title_loc_key,
                parent_meeting_item_id: agendaGroups[parent].items[child].parent_meeting_item_id,
                item_end_timestamp: agendaGroups[parent].items[child].item_end_timestamp,

              },
            });
          }
        }
      });
    }
  }
};

export default saveReOrder;
