const path = require("path");

const generateMeetingData = require(path.join(__dirname, 'generateMeetingData.js'));

const meetings = require(`./assets/meetings.json`);

// 1. generateMeetingData
const createMeetings = generateMeetingData(meetings);
createMeetings();
// 2. (tbd) generateAccountData
// 3. (tbd) generateSubscriptionsData