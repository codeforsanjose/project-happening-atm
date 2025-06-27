const path = require("path");

const generateMeetingData = require(path.join(__dirname, 'generateMeetingData.js'));
const generateAdminAccount = require(path.join(__dirname, 'generateAdminAccount.js'));

const meetings = require(`./assets/meetings.json`);
const adminAccount = require('./assets/adminAccount.json');

const SEED_DATA = {
    meetings: async () => generateMeetingData(meetings),
    adminAccount: async () => generateAdminAccount(adminAccount)
}

require('yargs')
    .scriptName("generate-seed-data")
    .usage('$0 <cmd>')
    .command('meetings', 'create some meeting data from ./assets/meetings.json',
        async function () {
            const generateMeetingData = SEED_DATA['meetings']
            await generateMeetingData();
        })
    .command('adminAccount', 'create some meeting data from ./assets/adminAccount.json',
        async function () {
            const generateAdminAccount = SEED_DATA['adminAccount']
            await generateAdminAccount();
        })
    .help()
    .argv

