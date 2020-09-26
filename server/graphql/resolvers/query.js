// TODO: error handling and data validation is required here
// ex: verify that ids exist, undefined values should be passed as empty strings, etc...

const getAllMeetings = async (dbClient) => {
    res = await dbClient.getAllMeetings();
    return res.rows;
};

const getMeeting = async (dbClient, id) => {
    res = await dbClient.getMeeting(id);
    return res.rows[0];
};

const getAllMeetingItems = async (dbClient) => {
    res = await dbClient.getAllMeetingItems();
    return res.rows;
};

const getMeetingItem = async (dbClient, id) => {
    res = await dbClient.getMeetingItem(id);
    return res.rows[0];
};

const getMeetingWithItems = async (dbClient, id) => {
    meetingObj = getMeeting(dbClient, id);
    res = await dbClient.getMeetingItemsByMeetingID(id);
    associatedItems = res.rows;

    return {
        meeting: meetingObj,
        items: associatedItems
    };
};

const getAllMeetingsWithItems = async (dbClient) => {
    meetingIDs = [];
    res = await dbClient.getAllMeetingIDs();
    res.rows.forEach(row => {
        meetingIDs.push(row.id);
    });

    allMeetingsWithItems = [];
    meetingIDs.forEach(id => {
        meetingWithItems = getMeetingWithItems(dbClient, id);
        allMeetingsWithItems.push(meetingWithItems);
    });

    return allMeetingsWithItems;
};

const getSubscription = async (dbClient, id) => {
    res = await dbClient.getSubscription(id);
    return res.rows[0];
};

const getAllSubscriptions = async (dbClient) => {
    res = await dbClient.getAllSubscriptions();
    return res.rows;
};

module.exports.getAllMeetings = getAllMeetings;
module.exports.getMeeting = getMeeting;
module.exports.getAllMeetingItems = getAllMeetingItems;
module.exports.getMeetingItem = getMeetingItem;
module.exports.getMeetingWithItems = getMeetingWithItems;
module.exports.getAllMeetingsWithItems = getAllMeetingsWithItems;
module.exports.getSubscription = getSubscription;
module.exports.getAllSubscriptions = getAllSubscriptions;
