// TODO: error handling and data validation is required here
// ex: verify that ids exist in related tables, undefined
// values should be passed as empty strings, etc...
const getSubscriptionController = require('../../controllers/subscriptionsController');
const getValidator = require('./validators');
const getAuthentication = require('./authentication');
const getsesClient = require('../../ses/sesClient');

module.exports = (logger) => {
  const subscriptionController = getSubscriptionController(logger);
  const validator = getValidator(logger);
  const authentication = getAuthentication(logger);
  const sesClient = getsesClient(logger);

  const module = {};

  module.confirmEmail = async (dbClient, args) => {
    try {
      await dbClient.toogleConfirmByToken(args.token, true);
    } catch (e) {
      logger.error(`createMeeting resolver error - dbClient.createMeeting: ${e}`);
      throw e;
    }

    return true;
  };

  module.unconfirmEmail = async (dbClient, args) => {
    try {
      await dbClient.toogleConfirmByToken(args.token, false);
    } catch (e) {
      logger.error(`createMeeting resolver error - dbClient.createMeeting: ${e}`);
      throw e;
    }

    return true;
  };

  module.createMeeting = async (dbClient, args, context) => {
    validator.validateAuthorization(context);
    validator.validateCreateMeeting(args);

    let res;
    try {
      res = await dbClient.createMeeting(
        args.meeting_type, args.meeting_start_timestamp,
        args.virtual_meeting_url, args.status, args.virtual_meeting_id,
        args.call_in_information, args.email_before_meeting,
        args.email_during_meeting, args.eComment, args.city_of_san_jose_meeting,
        args.youtube_link
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

  module.createMeetingItem = async (dbClient, args, context) => {
    validator.validateAuthorization(context);
    validator.validateCreateMeetingItem(args);

    let res;
    try {
      res = await dbClient.createMeetingItem(
        args.meeting_id, args.order_number, args.item_start_timestamp, args.item_end_timestamp,
        args.status, args.content_categories, args.description_loc_key, args.title_loc_key,
        args.parent_meeting_item_id,
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
    validator.validateUser(context);
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

  module.updateMeetingItem = async (dbClient, args, context) => {
    validator.validateAuthorization(context);
    validator.validateUpdateMeetingItem(args);

    let res;
    try {
      res = await dbClient.updateMeetingItem(
        args.id, args.order_number, args.status, args.item_start_timestamp,
        args.item_end_timestamp, args.content_categories, args.description_loc_key,
        args.title_loc_key, args.parent_meeting_item_id,
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

  module.updateMeeting = async (dbClient, args, context) => {
    validator.validateAuthorization(context);
    validator.validateUpdateMeeting(args);

    let res;
    try {
      res = await dbClient.updateMeeting(
        args.id, args.status, args.meeting_type, args.virtual_meeting_url,
        args.meeting_start_timestamp, args.meeting_end_timestamp,
        args.virtual_meeting_id, args.call_in_information,
        args.email_before_meeting, args.email_during_meeting, args.eComment,
        args.city_of_san_jose_meeting, args.youtube_link
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

  module.deleteMeeting = async (dbClient, args, context) => {
    validator.validateAuthorization(context);

    let res;
    try {
      res = await dbClient.deleteMeeting(args.id);
    } catch (e) {
      logger.error(`deleteMeeting resolver error - dbClient.deleteMeeting: ${e}`);
      throw e;
    }
    return res;
  };

  module.createAccount = async (dbClient, args, context) => {
    let res;
    let user;
    if (context.token === null) {
      const isAdmin = await authentication.verifyAdmin(dbClient, args.email_address.toLowerCase().trim());
      const roles = isAdmin ? '{ADMIN}' : '{USER}';
      const password = await authentication.hashPassword(args.password);
      const token = await authentication.randomToken();
      user = {
        first_name: args.first_name,
        last_name: args.last_name,
        email_address: args.email_address,
        roles: roles,
        password: password,
        auth_type: "Local",
        token: token
      }
    } else {
      const issuer = await authentication.identifyTokenIssuer(context.token);
      // Creating account for Google Auth
      if (issuer === "accounts.google.com") {
        user = await authentication.verifyGoogleToken(dbClient, context.token);
      }
      //TODO: Need to add Microsoft Issuer namer
      if (issuer === "NEED TO ADD MICROSOFT ISSUER") {
        user = await authentication.verifyMicrosoftToken(dbClient, context.token);
      }
    }
    // Creating Account in DB
    try {
      // TODO: Need to add more to this validator
      validator.validateCreateAccount(user);
      // Formatting email address
      const lowerCaseEMailAddress = user.email_address.toLowerCase().trim();
      // Looking to see if email already in use
      const dbResponse = await dbClient.getAccountByEmail(lowerCaseEMailAddress)
      if (dbResponse.rows.length > 0) {
        logger.error('Email already signed up. Please login.')
        throw new Error('Email already signed up. Please login.')
      } else {
        res = await dbClient.createAccount(
          user.first_name, user.last_name, lowerCaseEMailAddress, user.roles, user.auth_type, user.password, user.token
        );
      }
    } catch (e) {
      logger.error(`createAccount resolver error - dbClient.createAccount: ${e}`);
      throw new Error(e);
    }

    // Grabbing user from database, creating JWT and verifying email address.
    try {
      const dbUser = await dbClient.getAccountById(res.rows[0].id);
      res = authentication.createJWT(dbUser);
      sesClient.sendConfirmEmail(dbUser.rows[0].email_address, dbUser.rows[0].token);
    } catch (e) {
      logger.error(`createAccount resolver error - dbClient.createAccount ${e}`);
      throw new Error(e);
    }

    return { token: res };
  };


  return module;
};
