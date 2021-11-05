const path = require("path");

const generateMeetingData = require(path.join(__dirname, 'generateMeetingData.js'));

const meetings = require(`./assets/meetings.json`);

// create cli so something like node index.js [meetings, account, subscription] 

// 1. generateMeetingData
generateMeetingData(meetings);
// 2. (tbd) generateAccountData
// 3. (tbd) generateSubscriptionsData