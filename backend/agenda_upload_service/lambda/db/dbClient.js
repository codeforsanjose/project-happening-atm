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

  const query = async (queryString, args, callback) => {
    logger.debug(queryString, args);
    try {
      return await client.query(queryString, args, callback);
    } catch (e) {
      logger.error(`dbClient query error: ${e.stack}`);
      logger.debug(`errored query: ${queryString}. errored args: ${args}`);
      throw e;
    }
  };

  const initTables = async () => {
    logger.info('Initializing DB tables if necessary');
    try {
      await query(`
      CREATE TABLE IF NOT EXISTS meeting (
        id SERIAL NOT NULL PRIMARY KEY,
        meeting_type VARCHAR(255),
        status VARCHAR(255),
        created_timestamp TIMESTAMP NOT NULL,
        updated_timestamp TIMESTAMP NOT NULL,
        meeting_start_timestamp TIMESTAMP NOT NULL,
        meeting_end_timestamp TIMESTAMP,
        virtual_meeting_url VARCHAR(255)
      );
      `);
    } catch (e) {
      logger.error(`Error creating meeting table: ${e}`);
      throw e;
    }

    try {
      await query(`
      CREATE TABLE IF NOT EXISTS meeting_item (
        id SERIAL NOT NULL PRIMARY KEY,
        meeting_id INT NOT NULL,
        parent_meeting_item_id INT,
        order_number INT,
        created_timestamp TIMESTAMP NOT NULL,
        updated_timestamp TIMESTAMP NOT NULL,
        item_start_timestamp TIMESTAMP,
        item_end_timestamp TIMESTAMP,
        status VARCHAR(255),
        content_categories VARCHAR(255),
        description_loc_key VARCHAR(255),
        title_loc_key VARCHAR(255),
        CONSTRAINT fk_meeting_id
            FOREIGN KEY(meeting_id)
                REFERENCES meeting(id)
      );
      `);
    } catch (e) {
      logger.error(`Error creating meeting_item table: ${e}`);
      throw e;
    }

    try {
      await query(`
      CREATE TABLE IF NOT EXISTS subscription (
        id SERIAL NOT NULL PRIMARY KEY,
        meeting_item_id INT,
        meeting_id INT,
        created_timestamp TIMESTAMP NOT NULL,
        updated_timestamp TIMESTAMP NOT NULL,
        phone_number VARCHAR(255),
        email_address VARCHAR(255)
      );
      `);
    } catch (e) {
      logger.error(`Error creating subscription table: ${e}`);
      throw e;
    }

    try {
      await query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL NOT NULL PRIMARY KEY,
        email_address VARCHAR(255)
      );
      `);
    } catch (e) {
      logger.error(`Error creating admin table: ${e}`);
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
    try {
      await initTables();
    } catch (e) {
      logger.error(`Error initializing tables: ${e}`);
      throw e;
    }
  };

  module.end = async () => {
    await client.end();
  };

  const convertMsToSeconds = (milliseconds) => {
    return milliseconds / 1000;
  };

  module.createMeeting = async (meetingType, meetingStartTimestamp, virtualMeetingUrl, status) => {
    logger.info('dbClient: createMeeting');
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO meeting(meeting_type, meeting_start_timestamp, virtual_meeting_url, created_timestamp, updated_timestamp, status)
        VALUES ($1, to_timestamp($2), $3, to_timestamp($4), to_timestamp($5), $6) 
        RETURNING id;`;
    return query(
      queryString, 
      [
        meetingType,
        convertMsToSeconds(meetingStartTimestamp),
        virtualMeetingUrl,
        convertMsToSeconds(createdTimestamp),
        convertMsToSeconds(updatedTimestamp),
        status
      ]
    );
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
        VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5), to_timestamp($6), to_timestamp($7), $8, $9, $10, $11) 
        RETURNING id;`;
    return query(queryString,
      [
        meetingId,
        parentMeetingItemId,
        orderNumber,
        convertMsToSeconds(createdTimestamp),
        convertMsToSeconds(updatedTimestamp),
        convertMsToSeconds(itemStartTimestamp),
        convertMsToSeconds(itemEndTimestamp),
        status,
        contentCategories,
        descriptionLocKey,
        titleLocKey
      ]
    );
  };

  module.getMeeting = async (id) => {
    logger.info('dbClient: getMeeting');
    return query(`SELECT * FROM meeting WHERE id = ${id}`);
  };

  module.deleteMeetingItemsFroMeeting = async (meetingId) => {
    logger.info('dbClient: getMeeting');
    return query(`DELETE FROM meeting_item WHERE meeting_id = ${meetingId}`);
  };

  return module;
};
