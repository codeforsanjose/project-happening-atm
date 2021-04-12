const { Client } = require('pg');
const { migrate } = require('postgres-migrations');
const format = require('pg-format');

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

  module.init = async () => {
    try {
      await client.connect();
      logger.info('DB connected');

      await migrate({ client }, './migrations');
      logger.info('Migrations completed successfully.');
    } catch (e) {
      logger.error(`DB connection error: ${e.stack}`);
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
        VALUES (
          $1,
          to_timestamp($2),
          $3,
          to_timestamp($4),
          to_timestamp($5),
          $6
        ) RETURNING id;`;
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

  module.getAllMeetings = async () => {
    logger.info('dbClient: getAllMeetings');
    return query('SELECT * FROM meeting');
  };

  module.getMeeting = async (id) => {
    logger.info('dbClient: getMeeting');
    const queryString = 'SELECT * FROM meeting WHERE id = $1';
    return query(queryString, [id]);
  };

  module.createMeetingItem = async (meetingId, orderNumber, itemStartTimestamp, itemEndTimestamp,
    status, contentCategories, descriptionLocKey, titleLocKey) => {
    logger.info('dbClient: createMeetingItem');
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO meeting_item(meeting_id, order_number, created_timestamp, updated_timestamp, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key)
        VALUES ($1, $2, to_timestamp($3), to_timestamp($4), to_timestamp($5), to_timestamp($6), $7, $8, $9, $10) 
        RETURNING id;`;
    return query(queryString,
      [
        meetingId,
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

  module.getAllMeetingItems = async () => {
    logger.info('dbClient: getAllMeetingItems');
    return query('SELECT * FROM meeting_item');
  };

  module.getMeetingItem = async (id) => {
    logger.info('dbClient: getMeetingItem');
    const queryString = 'SELECT * FROM meeting_item WHERE id = $1';
    return query(queryString, [id]);
  };

  module.getMeetingItemsByMeetingID = async (meetingId) => {
    logger.info('dbClient: getMeetingItemsByMeetingID');
    const queryString = 'SELECT * FROM meeting_item WHERE meeting_id = $1';
    return query(queryString, [meetingId]);
  };

  module.getAllMeetingIDs = async () => {
    logger.info('dbClient: getAllMeetingIDs');
    return query('SELECT id FROM meeting');
  };

  module.createSubscriptions = async (phoneNumber, emailAddress, meetings) => {
    logger.info('dbClient: createSubscriptions');
    const values = [];

    // Aggregate meetings into an array so we can INSERT in a single query.
    meetings.forEach((meeting) => {
      values.push([phoneNumber,
        emailAddress,
        meeting.meeting_item_id,
        meeting.meeting_id,
      ]);
    });

    const queryString = format(`
      INSERT INTO subscription(phone_number, email_address, meeting_item_id, meeting_id)
      VALUES %L
      RETURNING id;`,
      values);

    return query(queryString);
  };

  module.getSubscription = async (ids) => {
    logger.info('dbClient: getSubscription');
    const queryString = 'SELECT * FROM subscription WHERE id IN $1'
    return query(queryString, [ids]);
  };

  module.getSubscriptionsByMeetingID = async (id) => {
    logger.info('dbClient: getSubscriptionsByMeetingID');
    const queryString = 'SELECT * FROM subscription WHERE meeting_id = $1'
    return query(queryString, [id]);
  };

  module.getSubscriptionsByMeetingItemID = async (id) => {
    logger.info('dbClient: getSubscriptionsByMeetingItemID');
    const queryString = 'SELECT * FROM subscription WHERE meeting_item_id = $1'
    return query(queryString, [id]);
  };

  module.getAllSubscriptions = async () => {
    logger.info('dbClient: getAllSubscriptions');
    return query('SELECT * FROM subscription');
  };

  module.updateMeetingItem = async (id, orderNumber, status, itemStartTimestamp,
    itemEndTimestamp, contentCategories, descriptionLocKey, titleLocKey) => {
    logger.info('dbClient: updateMeetingItem');
    const updatedTimestamp = Date.now();
    const queryString = `
        UPDATE meeting_item
        SET
            order_number = $1,
            status = $2,
            item_start_timestamp = to_timestamp($3),
            item_end_timestamp = to_timestamp($4),
            updated_timestamp = to_timestamp($5),
            content_categories = $6,
            description_loc_key = $7,
            title_loc_key = $8
        WHERE id = $9`;
    return query(queryString, 
      [
        orderNumber, 
        status, 
        convertMsToSeconds(itemStartTimestamp),
        convertMsToSeconds(itemEndTimestamp),
        convertMsToSeconds(updatedTimestamp),
        contentCategories,
        descriptionLocKey,
        titleLocKey,
        id
      ]
    );
  };

  module.updateMeeting = async (id, status, meetingType, virtualMeetingUrl,
    meetingStartTimestamp, meetingEndTimestamp) => {
    logger.info('dbClient: updateMeeting');
    const updatedTimestamp = Date.now();
    const queryString = `
        UPDATE meeting
        SET
            status = $1,
            meeting_type = $2,
            virtual_meeting_url = $3,
            meeting_start_timestamp = to_timestamp($4),
            meeting_end_timestamp = to_timestamp($5),
            updated_timestamp = to_timestamp($6)
        WHERE id = $7`;
    return query(queryString,
      [
        status,
        meetingType,
        virtualMeetingUrl,
        convertMsToSeconds(meetingStartTimestamp),
        convertMsToSeconds(meetingEndTimestamp),
        convertMsToSeconds(updatedTimestamp),
        id
      ]
    );
  };

  module.getSubscriptionsByMeetingIDList = async (idList) => {
    logger.info('dbClient: getSubscriptionsByMeetingIDList');
    let idListString = '';
    idList.forEach((id) => {
      if (idListString === '') {
        idListString += `(${id}`;
      } else {
        idListString += `, ${id}`;
      }
    });
    idListString += ')';
    const queryString = 'SELECT * FROM subscription WHERE meeting_item_id in $1';
    return query(queryString, [idListString]);
  };

  module.getAdminByEmail = async (email) => {
    logger.info('dbClient: getAdminByEmail');
    const queryString = 'SELECT * FROM admin WHERE email_address = $1';
    return query(queryString, [email]);
  };

  module.toogleConfirmByToken = async (token, toogleBoolean) => {
    logger.info('dbClient: unconfirmUserByToken');
    const queryString = 'UPDATE account SET email_address_subscribed = $1 WHERE token = $2';
    return query(queryString, [toogleBoolean, token]);
  };

  module.createAccount = async (first_name, last_name, email_address, roles, auth_type, password, token) => {
    logger.info('dbClient: createAccount');
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO account(first_name,last_name, email_address, roles, password, auth_type, token, created_timestamp, updated_timestamp)
        VALUES ('${first_name}','${last_name}', '${email_address}', '${roles}', '${password}', '${auth_type}', '${token}', to_timestamp(${createdTimestamp}), to_timestamp(${updatedTimestamp}) )
        RETURNING id;`;
    return query(queryString);
  };

  module.getAccountByEmail = async (email) => {
    logger.info('dbClient: getAccountByEmail');
    return query(`SELECT * FROM account WHERE email_address = '${email}'`);
  };

  module.getAccountById = async (id) => {
    logger.info('dbClient: getAccountById ');
    return query(`SELECT * FROM account WHERE id = ${id}`);
  };

  return module;
};
