const getTwilioClient = require('../twilio/twilioClient');

module.exports = (logger) => {
  const module = {};
  const twilioClient = getTwilioClient(logger);

  const notifySubscribers = async (dbClient, messageBody, subscriptionQueryResponse) => {
    // Here we'll populate phone number and email maps to store subscription data.
    // Users can be subscribed to multiple items that have identical "order numbers".
    // This means that users can be subscribed to items that are scheduled at the same time.
    // Rather than having individual texts for every subscription, we should intelligently include
    // simultaneously scheduled subscription data in a single text message notification.
    // We'll do this by associating subscription data array values to contact keys in maps.
    const phoneNumberMap = new Map();
    const emailMap = new Map();
    const subscriptions = subscriptionQueryResponse.rows;
    subscriptions.forEach((sub) => {
      const phoneNumber = sub.phone_number;
      const email = sub.phone_number.email_address;
      if (phoneNumber !== '') {
        if (phoneNumberMap.has(phoneNumber)) {
          if (!phoneNumberMap.get(phoneNumber).includes(sub)) {
            phoneNumberMap.get(phoneNumber).push(sub);
          }
        } else {
          phoneNumberMap.set(phoneNumber, [sub]);
        }
      }
      if (email !== '') {
        if (emailMap.has(email)) {
          if (!emailMap.get(email).includes(sub)) {
            emailMap.get(email).push(sub);
          }
        } else {
          emailMap.set(sub.email, [sub]);
        }
      }
    });

    const getTitlesArray = async (subscriptionArray) => {
      const titles = [];
      for (let i = 0; i < subscriptionArray.length; i += 1) {
        const sub = subscriptionArray[i];
        if (sub.meeting_item_id !== 0) {
          let res;
          try {
            // eslint-disable-next-line no-await-in-loop
            res = await dbClient.getMeetingItem(sub.meeting_item_id);
          } catch (e) {
            logger.error(`notifySubscribers controller error - dbClient.getMeetingItem: ${e}`);
            throw e;
          }
          const item = res.rows[0];
          titles.push(`"${item.title_loc_key}"`);
        } else {
          let res;
          try {
            // eslint-disable-next-line no-await-in-loop
            res = await dbClient.getMeeting(sub.meeting_id);
          } catch (e) {
            logger.error(`notifySubscribers controller error - dbClient.getMeeting: ${e}`);
            throw e;
          }
          const meeting = res.rows[0];
          titles.push(`"${meeting.meeting_type}"`);
        }
      }
      return titles;
    };

    // Gather each phone number's subscription data for their text message notification
    const phoneNumbers = [...phoneNumberMap.keys()];
    for (let i = 0; i < phoneNumbers.length; i += 1) {
      const number = phoneNumbers[i];
      const associatedSubscriptionArray = phoneNumberMap.get(number);
      let titles;
      try {
        // eslint-disable-next-line no-await-in-loop
        titles = await getTitlesArray(associatedSubscriptionArray);
      } catch (e) {
        logger.error(`notifySubscribers controller error - getTitlesArray: ${e}`);
        throw e;
      }
      const updateMessageBody = messageBody + titles;
      twilioClient.sendTextMessage(number, updateMessageBody);
      // TODO: To avoid API rate limit issues, it might be a good idea to
      // implement some kind of sleep logic here
    }
  };

  module.notifyItemSubscribers = async (dbClient, id, messageBody) => {
    logger.info('Notifying item subscribers');
    let res;
    try {
      res = await dbClient.getSubscriptionsByMeetingItemID(id);
    } catch (e) {
      logger.error(`notifyItemSubscribers controller error - getTidbClient.getSubscriptionsByMeetingItemID: ${e}`);
      throw e;
    }

    try {
      await notifySubscribers(dbClient, messageBody, res);
    } catch (e) {
      logger.error(`notifyItemSubscribers controller error - notifySubscribers: ${e}`);
      throw e;
    }
  };

  module.notifyMeetingSubscribers = async (dbClient, id, messageBody) => {
    logger.info('Notifying meeting subscribers');
    let res;
    try {
      res = await dbClient.getSubscriptionsByMeetingID(id);
    } catch (e) {
      logger.error(`notifyMeetingSubscribers controller error - dbClient.getSubscriptionsByMeetingID: ${e}`);
      throw e;
    }

    try {
      await notifySubscribers(dbClient, messageBody, res);
    } catch (e) {
      logger.error(`notifyMeetingSubscribers controller error - notifySubscribers: ${e}`);
      throw e;
    }
  };

  module.notifyNextItemSubscribers = async (dbClient, meetingItem, messageBody) => {
    logger.info('Notifying next item subscribers');
    const meetingID = meetingItem.meeting_id;
    const currentOrderNumber = meetingItem.order_number;

    let res;
    try {
      res = await dbClient.getMeetingItemsByMeetingID(meetingID);
    } catch (e) {
      logger.error(`notifyNextItemSubscribers controller error - dbClient.getMeetingItemsByMeetingID: ${e}`);
      throw e;
    }
    const meetingItems = res.rows;

    const nextItemsids = [];
    meetingItems.forEach((item) => {
      if (item.order_number === currentOrderNumber + 1) {
        nextItemsids.push(item.id);
      }
    });

    let subscriptionsRes;
    try {
      subscriptionsRes = await dbClient.getSubscriptionsByMeetingIDList(nextItemsids);
    } catch (e) {
      logger.error(`notifyNextItemSubscribers controller error - dbClient.getSubscriptionsByMeetingIDList: ${e}`);
      throw e;
    }

    try {
      await notifySubscribers(dbClient, messageBody, subscriptionsRes);
    } catch (e) {
      logger.error(`notifyNextItemSubscribers controller error - notifySubscribers: ${e}`);
      throw e;
    }
  };

  return module;
};
