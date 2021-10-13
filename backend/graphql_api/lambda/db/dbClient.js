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

  module.createMeeting = async (meetingType, meetingStartTimestamp, virtualMeetingUrl, status, virtualMeetingId, callInInformation, emailBeforeMeeting, emailDuringMeeting, eComment, cityOfSanJoseMeeting, youtubeLink) => {
    logger.info('dbClient: createMeeting');
    logger.info(virtualMeetingId);
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO meeting(meeting_type, meeting_start_timestamp, virtual_meeting_url, created_timestamp, updated_timestamp, status, virtual_meeting_id, call_in_information, email_before_meeting, email_during_meeting, ecomment, city_of_san_jose_meeting, youtube_link)
        VALUES (
          $1,
          to_timestamp($2),
          $3,
          to_timestamp($4),
          to_timestamp($5),
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13
        ) RETURNING id;`;
    return query(
      queryString,
      [
        meetingType,
        convertMsToSeconds(meetingStartTimestamp),
        virtualMeetingUrl,
        convertMsToSeconds(createdTimestamp),
        convertMsToSeconds(updatedTimestamp),
        status,
        virtualMeetingId,
        callInInformation,
        emailBeforeMeeting,
        emailDuringMeeting,
        eComment,
        cityOfSanJoseMeeting,
        youtubeLink
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

  module.deleteMeeting = async (id) => {
    logger.info('dbClient: deleteMeeting');
    const queryString = 'DELETE FROM meeting WHERE id = $1';
    return query(queryString, [id]);
  };

  module.createMeetingItem = async (meetingId, orderNumber, itemStartTimestamp, itemEndTimestamp,
    status, contentCategories, descriptionLocKey, titleLocKey, parentMeetingItemId) => {
    logger.info('dbClient: createMeetingItem');
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO meeting_item(meeting_id, order_number, created_timestamp, updated_timestamp,
          item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key,
          title_loc_key, parent_meeting_item_id)
        VALUES ($1, $2, to_timestamp($3), to_timestamp($4), to_timestamp($5), to_timestamp($6),
          $7, $8, $9, $10, $11)
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
        titleLocKey,
        parentMeetingItemId
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

    // Aggregate meetings into an array so we can INSERT in a single query.
    const itemIds = meetings.map(meeting => parseInt(meeting.meeting_item_id, 10));

    let paramIndex = 3;
    let idParams = itemIds.map(itemId => `\$${paramIndex++}`);
    const queryString = `
      INSERT INTO subscription(phone_number, email_address, meeting_item_id, meeting_id)
      (SELECT $1 AS phone_number, $2 AS email_address, id AS meeting_item_id, meeting_id AS meeting_id 
        FROM meeting_item WHERE id IN (${idParams.join(', ')}))
      RETURNING id;`;

    return query(queryString, [
      phoneNumber,
      emailAddress,
      ...itemIds
    ]);
  };

  module.getSubscription = async (ids) => {
    logger.info('dbClient: getSubscription');
    let paramIndex = 1;
    let idParams = ids.map(id => `\$${paramIndex++}`);    
    const queryString = `SELECT * FROM subscription WHERE id IN (${idParams.join(', ')})`;
    return query(queryString, [...ids]);
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
    itemEndTimestamp, contentCategories, descriptionLocKey, titleLocKey, parentMeetingItemId) => {
    logger.info('dbClient: updateMeetingItem');
    const updatedTimestamp = Date.now();
    const queryString = `
        UPDATE meeting_item
        SET
            order_number = $2,
            status = $3,
            item_start_timestamp = to_timestamp($4),
            item_end_timestamp = to_timestamp($5),
            updated_timestamp = to_timestamp($6),
            content_categories = $7,
            description_loc_key = $8,
            title_loc_key = $9,
            parent_meeting_item_id = $10
        WHERE id = $1`;
    return query(queryString,
      [
        id,
        orderNumber,
        status,
        convertMsToSeconds(itemStartTimestamp),
        convertMsToSeconds(itemEndTimestamp),
        convertMsToSeconds(updatedTimestamp),
        contentCategories,
        descriptionLocKey,
        titleLocKey,
        parentMeetingItemId
      ]
    );
  };

  module.updateMeeting = async (id, status, meetingType, virtualMeetingUrl,
    meetingStartTimestamp, meetingEndTimestamp, virtualMeetingId,
    callInInformation, emailBeforeMeeting, emailDuringMeeting, eComment,
    cityOfSanJoseMeeting, youtubeLink) => {
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
            updated_timestamp = to_timestamp($6),
            virtual_meeting_id = $7,
            call_in_information = $8,
            email_before_meeting = $9,
            email_during_meeting = $10,
            ecomment = $11,
            city_of_san_jose_meeting = $12,
            youtube_link = $13
        WHERE id = $14`;
    return query(queryString,
      [
        status,
        meetingType,
        virtualMeetingUrl,
        convertMsToSeconds(meetingStartTimestamp),
        convertMsToSeconds(meetingEndTimestamp),
        convertMsToSeconds(updatedTimestamp),
        virtualMeetingId,
        callInInformation,
        emailBeforeMeeting,
        emailDuringMeeting,
        eComment,
        cityOfSanJoseMeeting,
        youtubeLink,
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

  module.createAccount = async (email_address, phone_number, password, roles, auth_type, token) => {
    logger.info('dbClient: createAccount');
    const now = Date.now();
    const createdTimestamp = now;
    const updatedTimestamp = now;
    const queryString = `
        INSERT INTO account(email_address, phone_number, password, roles, auth_type, token, created_timestamp, updated_timestamp)
        VALUES ('${email_address}', '${phone_number}', '${password}', '${roles}', '${auth_type}', '${token}', to_timestamp(${createdTimestamp}), to_timestamp(${updatedTimestamp}) )
        RETURNING id;`;
    return query(queryString);
  };

  module.getAllAccounts = async () => {
    logger.info('dbClient: getAllAccounts');
    return query('SELECT * FROM account');
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
