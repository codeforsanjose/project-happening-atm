// TODO: error handling and data validation is required here
// ex: verify that ids exist in related tables, undefined
// values should be passed as empty strings, etc...
const getSubscriptionController = require('../../controllers/subscriptionsController');
const getValidator = require('./validators');

module.exports = (logger, dbClient, twilioClient) => {
  const subscriptionController = getSubscriptionController(logger, dbClient, twilioClient);
  const validator = getValidator(logger);

  const module = {};

  module.createMeeting = async (args) => {
    validator.validateCreateMeeting(args);
    let res = await dbClient.createMeeting(
      args.meeting_type, args.meeting_start_timestamp, args.virtual_meeting_url, args.status,
    );

    if (res != null) {
      const newId = res.rows[0].id;
      res = await dbClient.getMeeting(newId);
    } else {
      throw Error('Internal Error');
    }

    if (res != null) {
      return res.rows[0];
    }
    throw Error('Internal Error');
  };

  module.createMeetingItem = async (args) => {
    validator.validateCreateMeetingItem(args);
    let res = await dbClient.createMeetingItem(
      args.meeting_id, args.order_number, args.item_start_timestamp, args.item_end_timestamp,
      args.status, args.content_categories, args.description_loc_key, args.title_loc_key,
    );
    const newId = res.rows[0].id;
    res = await dbClient.getMeetingItem(newId);
    return res.rows[0];
  };

  module.createSubscription = async (args) => {
    validator.validateCreateSubscription(args);
    let res = await dbClient.createSubscription(
      args.phone_number, args.email_address, args.meeting_item_id, args.meeting_id,
    );
    const newId = res.rows[0].id;
    res = await dbClient.getSubscription(newId);
    return res.rows[0];
  };

  module.updateMeetingItem = async (args) => {
    validator.validateUpdateMeetingItem(args);
    let res = await dbClient.updateMeetingItem(
      args.id, args.order_number, args.status, args.item_start_timestamp,
      args.item_end_timestamp, args.content_categories, args.description_loc_key,
      args.title_loc_key,
    );
    res = await dbClient.getMeetingItem(args.id);
    const meetingItem = res.rows[0];

    // TODO: Validation required: only send notifications if update was successful
    switch (args.status) {
      case 'COMPLETED':
        subscriptionController.notifyItemSubscribers(args.id, 'ITEM(S) COMPLETED: ');
        break;
      case 'IN PROGRESS':
        subscriptionController.notifyItemSubscribers(args.id, 'ITEM(S) IN PROGRESS: ');
        subscriptionController.notifyNextItemSubscribers(meetingItem, 'YOUR ITEM(S) IS/ARE UP NEXT: ');
        break;
      default:
          // TODO: This state should be impossible, handle as an error
    }

    return meetingItem;
  };

  module.updateMeeting = async (args) => {
    validator.validateUpdateMeeting(args);
    let res = await dbClient.updateMeeting(
      args.id, args.status, args.meeting_type, args.virtual_meeting_url,
      args.meeting_start_timestamp, args.meeting_end_timestamp,
    );

    // TODO: Validation required: only send notifications if update was successful
    switch (args.status) {
      case 'COMPLETED':
        subscriptionController.notifyMeetingSubscribers(args.id, 'MEETING COMPLETE: ');
        break;
      case 'IN PROGRESS':
        subscriptionController.notifyMeetingSubscribers(args.id, 'MEETING IN PROGRESS: ');
        break;
      default:
          // TODO: This state should be impossible, handle as an error
    }

    res = await dbClient.getMeeting(args.id);
    return res.rows[0];
  };

  return module;
};
