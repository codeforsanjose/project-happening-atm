const { Client } = require("pg");

module.exports = async (logger) => {
  const module = {};

  const client = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });

  client.on("error", (err) => {
    logger.error(`Error with DB: ${err.stack}`);
  });

  const query = async (queryString) => {
    logger.debug(queryString);
    try {
      return await client.query(queryString);
    } catch (e) {
      logger.error(`dbClient querry error: ${e.stack}`);
      logger.debug(`errored query: ${queryString}`);
      throw e;
    }
  };

  module.init = async () => {
    try {
      await client.connect();
      logger.info("DB connected");
    } catch (e) {
      logger.error(`DB connection error: ${e.stack}`);
      throw e;
    }
  };

  module.end = async () => {
    await client.end();
  };

  module.createMeeting = async (
    meetingType,
    meetingStartTimestamp,
    virtualMeetingUrl,
    status
  ) => {
    logger.info("dbClient: createMeeting");
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO meeting(meeting_type, meeting_start_timestamp, virtual_meeting_url, created_timestamp, updated_timestamp, status)
        VALUES ('${meetingType}', to_timestamp(${meetingStartTimestamp}), '${virtualMeetingUrl}', to_timestamp(${createdTimestamp}), to_timestamp(${updatedTimestamp}), '${status}')
        RETURNING id;`;
    return query(queryString);
  };

  module.getAllMeetings = async () => {
    logger.info("dbClient: getAllMeetings");
    return query("SELECT * FROM meeting");
  };

  module.getMeeting = async (id) => {
    logger.info("dbClient: getMeeting");
    return query(`SELECT * FROM meeting WHERE id = ${id}`);
  };

  module.createMeetingItem = async (
    meetingId,
    orderNumber,
    itemStartTimestamp,
    itemEndTimestamp,
    status,
    contentCategories,
    descriptionLocKey,
    titleLocKey
  ) => {
    logger.info("dbClient: createMeetingItem");
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO meeting_item(meeting_id, order_number, created_timestamp, updated_timestamp, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key)
        VALUES ('${meetingId}', '${orderNumber}', to_timestamp(${createdTimestamp}), to_timestamp(${updatedTimestamp}), to_timestamp(${itemStartTimestamp}), to_timestamp(${itemEndTimestamp}), '${status}', '${contentCategories}', '${descriptionLocKey}', '${titleLocKey}')
        RETURNING id;`;
    return query(queryString);
  };

  module.getAllMeetingItems = async () => {
    logger.info("dbClient: getAllMeetingItems");
    return query("SELECT * FROM meeting_item");
  };

  module.getMeetingItem = async (id) => {
    logger.info("dbClient: getMeetingItem");
    return query(`SELECT * FROM meeting_item WHERE id = ${id}`);
  };

  module.getMeetingItemsByMeetingID = async (meetingId) => {
    logger.info("dbClient: getMeetingItemsByMeetingID");
    return query(`SELECT * FROM meeting_item WHERE meeting_id = ${meetingId}`);
  };

  module.getAllMeetingIDs = async () => {
    logger.info("dbClient: getAllMeetingIDs");
    return query("SELECT id FROM meeting");
  };

  module.createSubscription = async (
    phoneNumber,
    emailAddress,
    meetingItemId,
    meetingId
  ) => {
    logger.info("dbClient: createSubscription");
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO subscription(phone_number, email_address, meeting_item_id, meeting_id, created_timestamp, updated_timestamp)
        VALUES ('${phoneNumber}', '${emailAddress}', '${meetingItemId}', '${meetingId}', to_timestamp(${createdTimestamp}), to_timestamp(${updatedTimestamp}) )
        RETURNING id;`;
    return query(queryString);
  };

  module.getSubscription = async (id) => {
    logger.info("dbClient: getSubscription");
    return query(`SELECT * FROM subscription WHERE id = ${id}`);
  };

  module.getSubscriptionsByMeetingID = async (id) => {
    logger.info("dbClient: getSubscriptionsByMeetingID");
    return query(`SELECT * FROM subscription WHERE meeting_id = ${id}`);
  };

  module.getSubscriptionsByMeetingItemID = async (id) => {
    logger.info("dbClient: getSubscriptionsByMeetingItemID");
    return query(`SELECT * FROM subscription WHERE meeting_item_id = ${id}`);
  };

  module.getAllSubscriptions = async () => {
    logger.info("dbClient: getAllSubscriptions");
    return query("SELECT * FROM subscription");
  };

  module.updateMeetingItem = async (
    id,
    orderNumber,
    status,
    itemStartTimestamp,
    itemEndTimestamp,
    contentCategories,
    descriptionLocKey,
    titleLocKey
  ) => {
    logger.info("dbClient: updateMeetingItem");
    const updatedTimestamp = Date.now();
    const queryString = `
        UPDATE meeting_item
        SET 
            order_number = '${orderNumber}',
            status = '${status}',
            item_start_timestamp = to_timestamp(${itemStartTimestamp}),
            item_end_timestamp = to_timestamp(${itemEndTimestamp}),
            updated_timestamp = to_timestamp(${updatedTimestamp}),
            content_categories = '${contentCategories}',
            description_loc_key = '${descriptionLocKey}',
            title_loc_key = '${titleLocKey}'
        WHERE id = ${id}`;
    return query(queryString);
  };

  module.updateMeeting = async (
    id,
    status,
    meetingType,
    virtualMeetingUrl,
    meetingStartTimestamp,
    meetingEndTimestamp
  ) => {
    logger.info("dbClient: updateMeeting");
    const updatedTimestamp = Date.now();
    const queryString = `
        UPDATE meeting
        SET 
            status = '${status}',
            meeting_type = '${meetingType}',
            virtual_meeting_url = '${virtualMeetingUrl}',
            meeting_start_timestamp = to_timestamp(${meetingStartTimestamp}),
            meeting_end_timestamp = to_timestamp(${meetingEndTimestamp}),
            updated_timestamp = to_timestamp(${updatedTimestamp})
        WHERE id = ${id}`;
    return query(queryString);
  };

  module.getSubscriptionsByMeetingIDList = async (idList) => {
    logger.info("dbClient: getSubscriptionsByMeetingIDList");
    let idListString = "";
    idList.forEach((id) => {
      if (idListString === "") {
        idListString += `(${id}`;
      } else {
        idListString += `, ${id}`;
      }
    });
    idListString += ")";
    return query(
      `SELECT * FROM subscription WHERE meeting_item_id in ${idListString}`
    );
  };

  module.getAdminByEmail = async (email) => {
    logger.info("dbClient: getAdminByEmail");
    return query(`SELECT * FROM admin WHERE email_address = '${email}'`);
  };

  return module;
};
