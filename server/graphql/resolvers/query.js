// TODO: error handling and data validation is required here
// ex: verify that ids exist, undefined values should be passed as empty strings, etc...

module.exports = (logger, dbClient) => {
    let module = {};

    const getAllMeetings = async () => {
        res = await dbClient.getAllMeetings();
        return res.rows;
    };
    
    const getMeeting = async (id) => {
        res = await dbClient.getMeeting(id);
        return res.rows[0];
    };
    
    const getAllMeetingItems = async () => {
        res = await dbClient.getAllMeetingItems();
        return res.rows;
    };
    
    const getMeetingItem = async (id) => {
        res = await dbClient.getMeetingItem(id);
        return res.rows[0];
    };
    
    const getMeetingWithItems = async (id) => {
        meetingObj = getMeeting(id);
        res = await dbClient.getMeetingItemsByMeetingID(id);
        associatedItems = res.rows;
    
        return {
            meeting: meetingObj,
            items: associatedItems
        };
    };
    
    const getAllMeetingsWithItems = async () => {
        meetingIDs = [];
        res = await dbClient.getAllMeetingIDs();
        res.rows.forEach(row => {
            meetingIDs.push(row.id);
        });
    
        allMeetingsWithItems = [];
        meetingIDs.forEach(id => {
            meetingWithItems = getMeetingWithItems(id);
            allMeetingsWithItems.push(meetingWithItems);
        });
    
        return allMeetingsWithItems;
    };
    
    const getSubscription = async (id) => {
        res = await dbClient.getSubscription(id);
        return res.rows[0];
    };
    
    const getAllSubscriptions = async () => {
        res = await dbClient.getAllSubscriptions();
        return res.rows;
    };
    
    module.getAllMeetings = getAllMeetings;
    module.getMeeting = getMeeting;
    module.getAllMeetingItems = getAllMeetingItems;
    module.getMeetingItem = getMeetingItem;
    module.getMeetingWithItems = getMeetingWithItems;
    module.getAllMeetingsWithItems = getAllMeetingsWithItems;
    module.getSubscription = getSubscription;
    module.getAllSubscriptions = getAllSubscriptions;
    return module;
};