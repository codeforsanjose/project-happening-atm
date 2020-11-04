// TODO: error handling and data validation is required here
// ex: verify that ids exist, undefined values should be passed as empty strings, etc...

module.exports = (logger, dbClient) => {
  const module = {};

  const getAllMeetings = async () => {
    const res = await dbClient.getAllMeetings();
    return res.rows;
  };

  const getMeeting = async (id) => {
    const res = await dbClient.getMeeting(id);
    return res.rows[0];
  };

  const getAllMeetingItems = async () => {
    const res = await dbClient.getAllMeetingItems();
    return res.rows;
  };

  const getMeetingItem = async (id) => {
    const res = await dbClient.getMeetingItem(id);
    return res.rows[0];
  };

  const getMeetingWithItems = async (id) => {
    const meetingObj = getMeeting(id);
    const res = await dbClient.getMeetingItemsByMeetingID(id);
    const associatedItems = res.rows;

    return {
      meeting: meetingObj,
      items: associatedItems,
    };
  };

  const getAllMeetingsWithItems = async () => {
    const meetingIDs = [];
    const res = await dbClient.getAllMeetingIDs();
    res.rows.forEach((row) => {
      meetingIDs.push(row.id);
    });

    const allMeetingsWithItems = [];
    meetingIDs.forEach((id) => {
      const meetingWithItems = getMeetingWithItems(id);
      allMeetingsWithItems.push(meetingWithItems);
    });

    return allMeetingsWithItems;
  };

  const getSubscription = async (id) => {
    const res = await dbClient.getSubscription(id);
    return res.rows[0];
  };

  const getAllSubscriptions = async () => {
    const res = await dbClient.getAllSubscriptions();
    return res.rows;
  };

  module.getAllMeetings = getAllMeetings;
  module.getMeeting = getMeeting;
  module.getAllMeetingItems = getAllMeetingItems;
  module.getMeetingItem = getMeetingItem;
  module.getMeetingWithItems = getMeetingWithItems;
  module.getAllMeetingsWithItems = getAllMeetingsWithItems;
  module.getSubscription = getSubscription;
  module.getAllSubscriptions = getAllSubscriptions;
  return module;
};
