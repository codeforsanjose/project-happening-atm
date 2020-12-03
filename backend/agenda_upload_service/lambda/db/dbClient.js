const { Client } = require('pg');

module.exports = async (logger) => {
  const module = {};

  const client = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });

  client.on('error', (err) => {
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
      logger.info('DB connected');
    } catch (e) {
      logger.error(`DB connection error: ${e.stack}`);
      throw e;
    }
  };

  module.end = async () => {
    await client.end();
  };

  module.createMeeting = async (meetingType, meetingStartTimestamp, virtualMeetingUrl, status) => {
    logger.info('dbClient: createMeeting');
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO meeting(meeting_type, meeting_start_timestamp, virtual_meeting_url, created_timestamp, updated_timestamp, status)
        VALUES ('${meetingType}', to_timestamp(${meetingStartTimestamp}), '${virtualMeetingUrl}', to_timestamp(${createdTimestamp}), to_timestamp(${updatedTimestamp}), '${status}')
        RETURNING id;`;
    return query(queryString);
  };

  module.createMeetingItem = async (
    meetingId, parentMeetingItemId, orderNumber,
    itemStartTimestamp, itemEndTimestamp,
    status, contentCategories, descriptionLocKey, titleLocKey,
  ) => {
    logger.info('dbClient: createMeetingItem');
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO meeting_item(meeting_id, parent_meeting_item_id, order_number, created_timestamp, updated_timestamp, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key)
        VALUES ('${meetingId}', ${parentMeetingItemId}, '${orderNumber}', to_timestamp(${createdTimestamp}), to_timestamp(${updatedTimestamp}), to_timestamp(${itemStartTimestamp}), to_timestamp(${itemEndTimestamp}), '${status}', '${contentCategories}', '${descriptionLocKey}', '${titleLocKey}')
        RETURNING id;`;
    return query(queryString);
  };

  module.createSubscription = async (phoneNumber, emailAddress, meetingItemId, meetingId) => {
    logger.info('dbClient: createSubscription');
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO subscription(phone_number, email_address, meeting_item_id, meeting_id, created_timestamp, updated_timestamp)
        VALUES ('${phoneNumber}', '${emailAddress}', '${meetingItemId}', '${meetingId}', to_timestamp(${createdTimestamp}), to_timestamp(${updatedTimestamp}) )
        RETURNING id;`;
    return query(queryString);
  };

  return module;
};
