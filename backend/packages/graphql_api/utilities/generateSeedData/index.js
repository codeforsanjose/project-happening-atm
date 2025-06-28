const yargs = require('yargs');
const generateMeetingData = require('./generateMeetingData');
const generateAdminAccount = require('./generateAdminAccount');

const meetings = require('./assets/meetings.json');
const adminAccount = require('./assets/adminAccount.json');

const SEED_DATA = {
  meetings: async () => generateMeetingData(meetings),
  adminAccount: async () => generateAdminAccount(adminAccount),
};

yargs
  .scriptName('generate-seed-data')
  .usage('$0 <cmd>')
  .command('meetings', 'create some meeting data from ./assets/meetings.json', async () => {
    const generateMeetingData = SEED_DATA.meetings;
    await generateMeetingData();
  })
  .command('adminAccount', 'create some meeting data from ./assets/adminAccount.json', async () => {
    const generateAdminAccount = SEED_DATA.adminAccount;
    await generateAdminAccount();
  })
  .parseSync();
