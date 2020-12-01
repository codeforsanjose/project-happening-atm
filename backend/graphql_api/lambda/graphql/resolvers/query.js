// TODO: error handling and data validation is required here
// ex: verify that ids exist, undefined values should be passed as empty strings, etc...

module.exports = (logger) => {
  const module = {};

  const getAllMeetings = async (dbClient) => {
    let res;
    try {
      res = await dbClient.getAllMeetings();
    } catch (e) {
      logger.error(
        `getAllMeetings resolver error - dbClient.getAllMeetings: ${e}`
      );
      throw e;
    }
    return res.rows;
  };

  const getMeeting = async (dbClient, id) => {
    let res;
    try {
      res = await dbClient.getMeeting(id);
    } catch (e) {
      logger.error(`getMeeting resolver error - dbClient.getMeeting: ${e}`);
      throw e;
    }
    return res.rows[0];
  };

  const getAllMeetingItems = async (dbClient) => {
    let res;
    try {
      res = await dbClient.getAllMeetingItems();
    } catch (e) {
      logger.error(
        `getAllMeetingItems resolver error - dbClient.getAllMeetingItems: ${e}`
      );
      throw e;
    }
    return res.rows;
  };

  const getMeetingItem = async (dbClient, id) => {
    let res;
    try {
      res = await dbClient.getMeetingItem(id);
    } catch (e) {
      logger.error(
        `getMeetingItem resolver error - dbClient.getMeetingItem: ${e}`
      );
      throw e;
    }
    return res.rows[0];
  };

  const getMeetingWithItems = async (dbClient, id) => {
    let meetingObj;
    try {
      meetingObj = await getMeeting(dbClient, id);
    } catch (e) {
      logger.error(`getMeetingWithItems resolver error - getMeeting: ${e}`);
      throw e;
    }

    let res;
    try {
      res = await dbClient.getMeetingItemsByMeetingID(id);
    } catch (e) {
      logger.error(
        `getMeetingWithItems resolver error - dbClient.getMeetingItemsByMeetingID: ${e}`
      );
      throw e;
    }
    const associatedItems = res.rows;

    return {
      meeting: meetingObj,
      items: associatedItems,
    };
  };

  const getAllMeetingsWithItems = async (dbClient) => {
    let res;
    try {
      res = await dbClient.getAllMeetingIDs();
    } catch (e) {
      logger.error(
        `getAllMeetingsWithItems resolver error - dbClient.getAllMeetingIDs: ${e}`
      );
      throw e;
    }

    const meetingIDs = [];
    res.rows.forEach((row) => {
      meetingIDs.push(row.id);
    });

    const allMeetingsWithItems = [];
    try {
      for (let i = 0; i < meetingIDs.length; i += 1) {
        const id = meetingIDs[i];
        // eslint-disable-next-line no-await-in-loop
        const meetingWithItems = await getMeetingWithItems(dbClient, id);
        allMeetingsWithItems.push(meetingWithItems);
      }
    } catch (e) {
      logger.error(
        `getAllMeetingsWithItems resolver error - getMeetingWithItems: ${e}`
      );
      throw e;
    }

    return allMeetingsWithItems;
  };

  const getSubscription = async (dbClient, id) => {
    let res;
    try {
      res = await dbClient.getSubscription(id);
    } catch (e) {
      logger.error(
        `getSubscription resolver error - dbClient.getSubscription: ${e}`
      );
      throw e;
    }
    return res.rows[0];
  };

  const getAllSubscriptions = async (dbClient) => {
    let res;
    try {
      res = await dbClient.getAllSubscriptions();
    } catch (e) {
      logger.error(
        `getAllSubscriptions resolver error - dbClient.getAllSubscriptions: ${e}`
      );
      throw e;
    }
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
