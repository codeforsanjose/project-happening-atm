// saves the new rendering
const saveReOrder = (agendaGroups, updateMeetingItem) => {
  for (let parent = 0; parent < agendaGroups.length; parent += 1) {
    for (let child = 0; child < agendaGroups[parent].items.length; child += 1) {
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
};

export default saveReOrder;
