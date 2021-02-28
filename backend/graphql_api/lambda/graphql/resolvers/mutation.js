// TODO: error handling and data validation is required here
// ex: verify that ids exist in related tables, undefined
// values should be passed as empty strings, etc...
const getSubscriptionController = require('../../controllers/subscriptionsController');
const getValidator = require('./validators');

module.exports = (logger) => {
  const subscriptionController = getSubscriptionController(logger);
  const validator = getValidator(logger);

  const module = {};

  module.createMeeting = async (dbClient, args) => {
    validator.validateCreateMeeting(args);

    let res;
    try {
      res = await dbClient.createMeeting(
        args.meeting_type, args.meeting_start_timestamp, args.virtual_meeting_url, args.status,
      );
    } catch (e) {
      logger.error(`createMeeting resolver error - dbClient.createMeeting: ${e}`);
      throw e;
    }

    if (res != null) {
      const newId = res.rows[0].id;
      try {
        res = await dbClient.getMeeting(newId);
      } catch (e) {
        logger.error(`createMeeting resolver error - dbClient.getMeeting: ${e}`);
        throw e;
      }
    } else {
      logger.error('createMeeting resolver error - dbClient.createMeeting response is null');
      throw Error('Internal Error');
    }

    if (res != null) {
      return res.rows[0];
    }
    logger.error('createMeeting resolver error - dbClient.getMeeting response is null');
    throw Error('Internal Error');
  };

  module.createMeetingItem = async (dbClient, args) => {
    validator.validateCreateMeetingItem(args);

    let res;
    try {
      res = await dbClient.createMeetingItem(
        args.meeting_id, args.order_number, args.item_start_timestamp, args.item_end_timestamp,
        args.status, args.content_categories, args.description_loc_key, args.title_loc_key,
      );
    } catch (e) {
      logger.error(`createMeetingItem resolver error - dbClient.createMeetingItem: ${e}`);
      throw e;
    }
    const newId = res.rows[0].id;

    try {
      res = await dbClient.getMeetingItem(newId);
    } catch (e) {
      logger.error(`createMeetingItem resolver error - dbClient.getMeetingItem: ${e}`);
      throw e;
    }
    return res.rows[0];
  };

  module.createSubscriptions = async (dbClient, args) => {
    validator.validateCreateSubscriptions(args);

    let res;
    try {
      res = await dbClient.createSubscriptions(
        args.phone_number, args.email_address, args.meetings,
      );
    } catch (e) {
      logger.error(`createSubscriptions resolver error - dbClient.createSubscriptions: ${e}`);
      throw e;
    }

    const ids = [];
    res.rows.forEach((row) => { ids.push(row.id); });

    try {
      res = await dbClient.getSubscription(ids);
    } catch (e) {
      logger.error(`createSubscriptions resolver error - dbClient.getSubscriptions: ${e}`);
      throw e;
    }
    return res.rows;
  };

  module.updateMeetingItem = async (dbClient, args) => {
    validator.validateUpdateMeetingItem(args);

    let res;
    try {
      res = await dbClient.updateMeetingItem(
        args.id, args.order_number, args.status, args.item_start_timestamp,
        args.item_end_timestamp, args.content_categories, args.description_loc_key,
        args.title_loc_key,
      );
    } catch (e) {
      logger.error(`updateMeetingItem resolver error - dbClient.updateMeetingItem: ${e}`);
      throw e;
    }

    // TODO: Check if update was successful

    try {
      res = await dbClient.getMeetingItem(args.id);
    } catch (e) {
      logger.error(`updateMeetingItem resolver error - dbClient.getMeetingItem: ${e}`);
      throw e;
    }
    const meetingItem = res.rows[0];

    // TODO: Validation required: only send notifications if update was successful
    switch (args.status) {
      case 'COMPLETED':
        try {
          await subscriptionController.notifyItemSubscribers(dbClient, args.id, 'ITEM(S) COMPLETED: ');
        } catch (e) {
          logger.error(`Error notifying item subscribers: ${e}`);
        }
        break;

      case 'IN PROGRESS':
        try {
          await subscriptionController.notifyItemSubscribers(dbClient, args.id, 'ITEM(S) IN PROGRESS: ');
        } catch (e) {
          logger.error(`Error notifying item subscribers: ${e}`);
        }
        try {
          await subscriptionController.notifyNextItemSubscribers(dbClient, meetingItem, 'YOUR ITEM(S) IS/ARE UP NEXT: ');
        } catch (e) {
          logger.error(`Error notifying "next" item subscribers: ${e}`);
        }
        break;
      default:
          // TODO: This state should be impossible, handle as an error
    }

    return meetingItem;
  };

  module.updateMeeting = async (dbClient, args) => {
    validator.validateUpdateMeeting(args);

    let res;
    try {
      res = await dbClient.updateMeeting(
        args.id, args.status, args.meeting_type, args.virtual_meeting_url,
        args.meeting_start_timestamp, args.meeting_end_timestamp,
      );
    } catch (e) {
      logger.error(`updateMeeting resolver error - dbClient.updateMeeting: ${e}`);
      throw e;
    }

    // TODO: Validation required: only send notifications if update was successful
    switch (args.status) {
      case 'COMPLETED':
        try {
          await subscriptionController.notifyMeetingSubscribers(dbClient, args.id, 'MEETING COMPLETE: ');
        } catch (e) {
          logger.error(`updateMeeting resolver error - subscriptionController.notifyMeetingSubscribers: ${e}`);
          throw e;
        }
        break;
      case 'IN PROGRESS':
        try {
          await subscriptionController.notifyMeetingSubscribers(dbClient, args.id, 'MEETING IN PROGRESS: ');
        } catch (e) {
          logger.error(`updateMeeting resolver error - subscriptionController.notifyMeetingSubscribers: ${e}`);
          throw e;
        }
        break;
      default:
          // TODO: This state should be impossible, handle as an error
    }

    try {
      res = await dbClient.getMeeting(args.id);
    } catch (e) {
      logger.error(`updateMeeting resolver error - dbClient.getMeeting: ${e}`);
      throw e;
    }
    return res.rows[0];
  };

  return module;
};
