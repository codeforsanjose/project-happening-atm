const { Client } = require("pg");

const logger = require("../logger");
require("dotenv").config({ path: "../../.env" });

const authentication = require('../../graphql/resolvers/authentication.js');

const { getAccountQuery, getAdminQuery } = require("./queries");

async function generateAdminAccount(account) {
  this.client = await setupClient();
  const auth = authentication(logger);

  await createAccount();
  // await endClient(); TODO: clean up this and add back

  /**
   * Creates our Client connected to our psql db
   * @returns {Client}
   */
  async function setupClient() {
    const client = new Client({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });

    await client.connect();

    return client;
  }
  /**
   * Given meetings object, create all meetings and nested meeting items
   * @param {Array<Object>} meetings
   */
  async function createAccount() {
    const hashedPassword = await auth.hashPassword(account.password)
    const token = auth.randomToken()

    const accountInfo = { ...account, password: hashedPassword, token }

    const insertAccountQuery = getAccountQuery(accountInfo);
    await this.client.query(insertAccountQuery, async (err, res) => {
      if (err) {
        logger.error(`error creating account ${err}`);
        return;
      }

      const { emailAddress } = account
      logger.info(`account with username: ${emailAddress} and password ${account.password} successfully created`);

      await this.client.query(getAdminQuery(emailAddress), async (err, res) => {
        if (err) {
          logger.error(`error creating admin account for ${emailAddress}`);
          return;
        }

        logger.info(`successfully created admin role for ${emailAddress}`)
      })
    });
  }

}

module.exports = generateAdminAccount;
