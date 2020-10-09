const { Client } = require('pg');

module.exports = (logger) => {
    var module = {}

    const client = new Client();

    client.connect(err => {
        if (err) {
            logger.error('DB connection error: ' + err.stack);
        } else {
            logger.info('DB connected');
        }
    });

    client.on('error', err => {
        logger.error('Error with DB: ' + err.stack);
    });

    const dbQuery = async (query_string) => {
        try {
            logger.debug('Query: ' + query_string)
            return await new Promise((resolve, reject) => {
                client.query(query_string, (err, res) => {
                    if (err) {
                        reject(err.stack);
                    }
                    resolve(res);
                })
            });
        }
        catch (err) {
            logger.error(err);
            return null
        }
    };

    module.createMeeting = async (meeting_type, meeting_start_timestamp, virtual_meeting_url, status) => {
        logger.info('dbClient: createMeeting');
        const now = Date.now();
        const created_timestamp = now;
        const updated_timestamp = now;
        const queryString = `
        INSERT INTO meeting(meeting_type, meeting_start_timestamp, virtual_meeting_url, created_timestamp, updated_timestamp, status)
        VALUES ('${meeting_type}', to_timestamp(${meeting_start_timestamp}), '${virtual_meeting_url}', to_timestamp(${created_timestamp}), to_timestamp(${updated_timestamp}), '${status}')
        RETURNING id;`;
        return dbQuery(queryString);
    };

    module.getAllMeetings = async () => {
        logger.info('dbClient: getAllMeetings');
        return dbQuery('SELECT * FROM meeting');
    };

    module.getMeeting = async (id) => {
        logger.info('dbClient: getMeeting');
        return dbQuery(`SELECT * FROM meeting WHERE id = ${id}`);
    };

    module.createMeetingItem = async (meeting_id, order_number, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key) => {
        logger.info('dbClient: createMeetingItem');
        const now = Date.now();
        const created_timestamp = now;
        const updated_timestamp = now;
        queryString = `
        INSERT INTO meeting_item(meeting_id, order_number, created_timestamp, updated_timestamp, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key)
        VALUES ('${meeting_id}', '${order_number}', to_timestamp(${created_timestamp}), to_timestamp(${updated_timestamp}), to_timestamp(${item_start_timestamp}), to_timestamp(${item_end_timestamp}), '${status}', '${content_categories}', '${description_loc_key}', '${title_loc_key}')
        RETURNING id;`;
        return dbQuery(queryString);
    };

    module.getAllMeetingItems = async () => {
        logger.info('dbClient: getAllMeetingItems');
        return dbQuery('SELECT * FROM meeting_item');
    };

    module.getMeetingItem = async (id) => {
        logger.info('dbClient: getMeetingItem');
        return dbQuery(`SELECT * FROM meeting_item WHERE id = ${id}`);
    };

    module.getMeetingItemsByMeetingID = async (meeting_id) => {
        logger.info('dbClient: getMegetMeetingItemsByMeetingIDetingItem');
        return dbQuery(`SELECT * FROM meeting_item WHERE meeting_id = ${meeting_id}`);
    };

    module.getAllMeetingIDs = async () => {
        logger.info('dbClient: getAllMeetingIDs');
        return dbQuery('SELECT id FROM meeting');
    };

    module.createSubscription = async (phone_number, email_address, meeting_item_id, meeting_id) => {
        logger.info('dbClient: createSubscription');
        const now = Date.now();
        const created_timestamp = now;
        const updated_timestamp = now;
        query_string = `
        INSERT INTO subscription(phone_number, email_address, meeting_item_id, meeting_id, created_timestamp, updated_timestamp)
        VALUES ('${phone_number}', '${email_address}', '${meeting_item_id}', '${meeting_id}', to_timestamp(${created_timestamp}), to_timestamp(${updated_timestamp}) )
        RETURNING id;`;
        return dbQuery(query_string);
    };

    module.getSubscription = async (id) => {
        logger.info('dbClient: getSubscription');
        return dbQuery(`SELECT * FROM subscription WHERE id = ${id}`);
    };

    module.getSubscriptionsByMeetingID = async (id) => {
        logger.info('dbClient: getSubscriptionsByMeetingID');
        return dbQuery(`SELECT * FROM subscription WHERE meeting_id = ${id}`);
    };

    module.getSubscriptionsByMeetingItemID = async (id) => {
        logger.info('dbClient: getSubscriptionsByMeetingItemID');
        return dbQuery(`SELECT * FROM subscription WHERE meeting_item_id = ${id}`);
    };

    module.getAllSubscriptions = async () => {
        logger.info('dbClient: getAllSubscriptions');
        return dbQuery("SELECT * FROM subscription");
    };

    module.updateMeetingItem = async (id, order_number, status, item_start_timestamp, item_end_timestamp, content_categories, description_loc_key, title_loc_key) => {
        logger.info('dbClient: updateMeetingItem');
        updated_timestamp = Date.now();
        query_string = `
        UPDATE meeting_item
        SET 
            order_number = '${order_number}',
            status = '${status}',
            item_start_timestamp = to_timestamp(${item_start_timestamp}),
            item_end_timestamp = to_timestamp(${item_end_timestamp}),
            updated_timestamp = to_timestamp(${updated_timestamp}),
            content_categories = '${content_categories}',
            description_loc_key = '${description_loc_key}',
            title_loc_key = '${title_loc_key}'
        WHERE id = ${id}`;
        return dbQuery(query_string);
    };

    module.updateMeeting = async (id, status, meeting_type, virtual_meeting_url, meeting_start_timestamp, meeting_end_timestamp) => {
        logger.info('dbClient: updateMeeting');
        updated_timestamp = Date.now();
        query_string = `
        UPDATE meeting
        SET 
            status = '${status}',
            meeting_type = '${meeting_type}',
            virtual_meeting_url = '${virtual_meeting_url}',
            meeting_start_timestamp = to_timestamp(${meeting_start_timestamp}),
            meeting_end_timestamp = to_timestamp(${meeting_end_timestamp}),
            updated_timestamp = to_timestamp(${updated_timestamp})
        WHERE id = ${id}`;
        return dbQuery(query_string);
    };

    module.getSubscriptionsByMeetingIDList = async (id_list) => {
        logger.info('dbClient: getSubscriptionsByMeetingIDList');
        id_list_string ='';
        id_list.forEach(id => {
            if (id_list_string === '') {
                id_list_string += '(' + id;
            }
            else {
                id_list_string += ', ' + id;
            }
        });
        id_list_string += ')';
        return dbQuery(`SELECT * FROM subscription WHERE meeting_item_id in ${id_list_string}`);
    };

    module.getAdminByEmail = async (email) => {
        logger.info('dbClient: getAdminByEmail');
        return dbQuery(`SELECT * FROM admin WHERE email_address = '${email}'`);
    };

    return module;
}