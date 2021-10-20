// TODO: error handling and data validation is required here
// ex: verify that ids exist, undefined values should be passed as empty strings, etc...
const getAuthentication = require('./authentication');
const getValidator = require('./validators');

module.exports = (logger) => {

  const authentication = getAuthentication(logger);
  const validator = getValidator(logger);

  const module = {};

  const getAllMeetings = async (dbClient) => {
    let res;
    try {
      res = await dbClient.getAllMeetings();
    } catch (e) {
      logger.error(`getAllMeetings resolver error - dbClient.getAllMeetings: ${e}`);
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
      logger.error(`getAllMeetingItems resolver error - dbClient.getAllMeetingItems: ${e}`);
      throw e;
    }
    return res.rows;
  };

  const getMeetingItem = async (dbClient, id) => {
    let res;
    try {
      res = await dbClient.getMeetingItem(id);
    } catch (e) {
      logger.error(`getMeetingItem resolver error - dbClient.getMeetingItem: ${e}`);
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
      logger.error(`getMeetingWithItems resolver error - dbClient.getMeetingItemsByMeetingID: ${e}`);
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
      logger.error(`getAllMeetingsWithItems resolver error - dbClient.getAllMeetingIDs: ${e}`);
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
      logger.error(`getAllMeetingsWithItems resolver error - getMeetingWithItems: ${e}`);
      throw e;
    }

    return allMeetingsWithItems;
  };

  const getSubscription = async (dbClient, id) => {
    let res;
    try {
      res = await dbClient.getSubscription(id);
    } catch (e) {
      logger.error(`getSubscription resolver error - dbClient.getSubscription: ${e}`);
      throw e;
    }
    return res.rows[0];
  };

  const getAllSubscriptions = async (dbClient, args, context) => {
    validator.validateAuthorization(context);
    let res;
    try {
      res = await dbClient.getAllSubscriptions();
    } catch (e) {
      logger.error(`getAllSubscriptions resolver error - dbClient.getAllSubscriptions: ${e}`);
      throw e;
    }
    return res.rows;
  };

  const loginLocal = async (dbClient, email_address, password) => {
    let token;
    try {
      if (password === undefined || password === null || password == "") {
        logger.error('Unable to authenticate no password provided')
        throw new Error('Unable to authenticate no password provided')
      } else {
        const user = await authentication.verifyEmailPassword(dbClient, email_address, password);
        validator.validateAuthType(user.rows[0].auth_type, "Local");
        token = await authentication.createJWT(user);
      }
    } catch (e) {
      logger.error(`loginLocal resolver error: ${e}`);
      throw e;
    }
    return { token: token }
  };

  const loginGoogle = async (dbClient, context) => {
    let token;
    try {
      const user = {
        rows:[]
      };
      user.rows.push(await authentication.verifyGoogleToken(dbClient, context.token));
      validator.validateAuthType(user.rows[0].auth_type, "Google");
      token = await authentication.createJWT(user);
    } catch (e) {
      logger.error(`loginGoogle resolver error: ${e}`);
      throw e;
    }
    return { token: token };
  };

  const loginMicrosoft = async (dbClient, context) => {
    let token;
    try {
      const user = await authentication.verifyMicrosoftToken(dbClient, context.token);
      validator.validateAuthType(user.rows[0].auth_type, "Microsoft");
      token = await authentication.createJWT(user);
    } catch (e) {
      logger.error(`loginMicrosoft resolver error: ${e}`);
      throw e;
    }
    return { token: token };
  };

  const verifyToken = async (dbClient, context) => {
    //TODO: add logic to verify a token if sent to the server
  }

  module.getAllMeetings = getAllMeetings;
  module.getMeeting = getMeeting;
  module.getAllMeetingItems = getAllMeetingItems;
  module.getMeetingItem = getMeetingItem;
  module.getMeetingWithItems = getMeetingWithItems;
  module.getAllMeetingsWithItems = getAllMeetingsWithItems;
  module.getSubscription = getSubscription;
  module.getAllSubscriptions = getAllSubscriptions;
  module.loginLocal = loginLocal;
  module.loginGoogle = loginGoogle;
  module.loginMicrosoft = loginMicrosoft;
  module.verifyToken = verifyToken;

  return module;
};
