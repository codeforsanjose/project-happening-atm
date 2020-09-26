const notifySubscribers = (twilioClient, dbClient, messageBody, subscriptionQueryResponse) => {
    // Here we'll populate phone number and email maps to store subscription data.
    // Users can be subscribed to multiple items that have identical "order numbers".
    // This means that users can be subscribed to items that are scheduled at the same time.
    // Rather than having individual texts for every subscription, we should intelligently include
    // simultaneously scheduled subscription data in a single text message notification.
    // We'll do this by associating subscription data array values to contact keys in maps.
    phoneNumberMap = new Map();
    emailMap = new Map();
    const subscriptions = subscriptionQueryResponse.rows;
    subscriptions.forEach(sub => {
        phoneNumber = sub.phone_number;
        email = sub.phone_number.email_address;
        if (phoneNumber !== '') {
            if (phoneNumberMap.has(phoneNumber)) {
                if (!phoneNumberMap.get(phoneNumber).includes(sub)) {
                    phoneNumberMap.get(phoneNumber).push(sub);
                }
            }
            else {
                phoneNumberMap.set(phoneNumber, [sub]);
            }
        }
        if (email !== '') {
            if (emailMap.has(email)) {
                if (!emailMap.get(email).includes(sub)) {
                    emailMap.get(email).push(sub);
                }
            }
            else {
                emailMap.set(sub.email, [sub]);
            }
        }
    });

    const getTitlesArray = async (subscriptionArray) => {
        let titles = [];
        for (let i = 0; i < subscriptionArray.length; i++) {
            sub = subscriptionArray[i]
            if (sub.meeting_item_id !== 0) {
                res = await dbClient.getMeetingItem(sub.meeting_item_id);
                item = res.rows[0];
                titles.push('"' + item.title_loc_key + '"');
            }
            else {
                res = await dbClient.getMeeting(sub.meeting_id);
                meeting = res.rows[0];
                titles.push('"' + meeting.meeting_type + '"');
            }
        }
        return titles;
    };

    // Gather each phone number's subscription data for their text message notification
    [...phoneNumberMap.keys()].forEach( async number => {
        let associatedSubscriptionArray = phoneNumberMap.get(number);
        let titles = await getTitlesArray(associatedSubscriptionArray);
        let updateMessageBody = messageBody + titles;
        twilioClient.sendTextMessage(phoneNumber, updateMessageBody);
        // TODO: To avoid API rate limit issues, it might be a good idea to implement some kind of sleep logic here
    });
}

module.exports.notifyItemSubscribers = async (twilioClient, dbClient, id, message_body) => {
    res = await dbClient.getSubscriptionsByMeetingItemID(id);
    notifySubscribers(twilioClient, dbClient, message_body, res);
};

module.exports.notifyMeetingSubscribers = async (twilioClient, dbClient, id, message_body) => {
    res = await dbClient.getSubscriptionsByMeetingID(id);
    notifySubscribers(twilioClient, dbClient, message_body, res);
};

module.exports.notifyNextItemSubscribers = async (twilioClient, dbClient, meeting_item, message_body) => {
    meeting_id = meeting_item['meeting_id'];
    current_order_number = meeting_item['order_number'];

    res = await dbClient.getMeetingItemsByMeetingID(meeting_id);
    meeting_items = res.rows;

    next_items_ids = [];
    meeting_items.forEach(item => {
        if (item.order_number === current_order_number + 1) {
            next_items_ids.push(item.id);
        }
    });

    res = await dbClient.getSubscriptionsByMeetingIDList(next_items_ids);
    notifySubscribers(twilioClient, dbClient, message_body, res);
}