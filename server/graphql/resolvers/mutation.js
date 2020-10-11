// TODO: error handling and data validation is required here
// ex: verify that ids exist in related tables, undefined
// values should be passed as empty strings, etc...
const getSubscriptionController = require('../../controllers/subscriptionsController');

module.exports = (logger, dbClient, twilioClient) => {
  const subscriptionController = getSubscriptionController(logger, dbClient, twilioClient);

  const module = {};

  module.createMeeting = async (meetingType, meetingStartTimestamp, virtualMeetingUrl, status) => {
    let res = await dbClient.createMeeting(
      meetingType, meetingStartTimestamp, virtualMeetingUrl, status,
    );
    const newId = res.rows[0].id;
    res = await dbClient.getMeeting(newId);
    return res.rows[0];
  };

  module.createMeetingItem = async (
    meetingId, orderNumber, itemStartTimestamp, itemEndTimestamp,
    status, contentCategories, descriptionLocKey, titleLocKey,
  ) => {
    let res = await dbClient.createMeetingItem(
      meetingId, orderNumber, itemStartTimestamp, itemEndTimestamp,
      status, contentCategories, descriptionLocKey, titleLocKey,
    );
    const newId = res.rows[0].id;
    res = await dbClient.getMeetingItem(newId);
    return res.rows[0];
  };

  module.createSubscription = async (phoneNumber, emailAddress, meetingItemId, meetingId) => {
    let res = await dbClient.createSubscription(
      phoneNumber, emailAddress, meetingItemId, meetingId,
    );
    const newId = res.rows[0].id;
    res = await dbClient.getSubscription(newId);
    return res.rows[0];
  };

  module.updateMeetingItem = async (
    id, orderNumber, status, itemStartTimestamp,
    itemEndTimestamp, contentCategories, descriptionLocKey, titleLocKey,
  ) => {
    let res = await dbClient.updateMeetingItem(
      id, orderNumber, status, itemStartTimestamp,
      itemEndTimestamp, contentCategories, descriptionLocKey, titleLocKey,
    );
    res = await dbClient.getMeetingItem(id);
    const meetingItem = res.rows[0];

    // TODO: Validation required: only send notifications if update was successful
    switch (status) {
      case 'COMPLETED':
        subscriptionController.notifyItemSubscribers(id, 'ITEM(S) COMPLETED: ');
        break;
      case 'IN PROGRESS':
        subscriptionController.notifyItemSubscribers(id, 'ITEM(S) IN PROGRESS: ');
        subscriptionController.notifyNextItemSubscribers(meetingItem, 'YOUR ITEM(S) IS/ARE UP NEXT: ');
        break;
      default:
          // TODO: This state should be impossible, handle as an error
    }

    return meetingItem;
  };

  module.updateMeeting = async (
    id, status, meetingType, virtualMeetingUrl,
    meetingStartTimestamp, meetingEndTimestamp,
  ) => {
    let res = await dbClient.updateMeeting(
      id, status, meetingType, virtualMeetingUrl,
      meetingStartTimestamp, meetingEndTimestamp,
    );

    // TODO: Validation required: only send notifications if update was successful
    switch (status) {
      case 'COMPLETED':
        subscriptionController.notifyMeetingSubscribers(id, 'MEETING COMPLETE: ');
        break;
      case 'IN PROGRESS':
        subscriptionController.notifyMeetingSubscribers(id, 'MEETING IN PROGRESS: ');
        break;
      default:
          // TODO: This state should be impossible, handle as an error
    }

    res = await dbClient.getMeeting(id);
    return res.rows[0];
  };

  return module;
};
