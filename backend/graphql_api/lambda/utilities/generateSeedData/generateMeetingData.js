const { Client } = require("pg");

const logger = require("../logger");
require("dotenv").config({ path: "../../.env" });

const { getMeetingQuery, getMeetingItemQuery } = require("./queries");


async function generateMeetingData(meetings) {

    this.client = await setupClient()
    await printMeetingInfo();
    await createMeetings(meetings);
    await printMeetingInfo();
    // await endClient(); TODO: clean up this and add back

    /**
     * Given meetings object, create all meetings and nested meeting items 
     * @param {Array<Object>} meetings 
     */
    async function createMeetings(meetings) {
        await meetings.forEach(async (meetingInfo) => {
            // created successfully, what do I wnat to log?
            const { meetingItems } = meetingInfo
            const insertMeetingQuery = getMeetingQuery(meetingInfo);
            await this.client.query(insertMeetingQuery, async (err, res) => {
                if (err) {
                    logger.error(`error creating meeting ${err}`);
                    return;
                }

                const { rows: meeting } = res;

                await meeting.forEach(async ({ id: meetingId, meeting_type, created_timestamp }) => {
                    logger.info(
                        `meeting of id ${meetingId}, type ${meeting_type} was successfully created.` +
                        `meeting created at ${created_timestamp}`
                    )

                    if (meetingItems) {
                        await createMeetingItems(meetingId, meetingItems);
                    }
                }
                );
            });
        });
    }

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
     * 
     * @param {number} meetingId id of the meeting id this meeting item belongs to 
     * @param {Array<MeetingItems>} meetingItems the meeting items we want to create
     * @param {number | undefined} parentMeetingItemId if nested, the number will refer to parent meeting item id, otherwise undefined just means meeting item is not nested
     */
    async function createMeetingItems(meetingId, meetingItems, parentMeetingItemId) {
        await meetingItems.forEach(async (meetingItem) => {
            const { meetingItems: nestedMeetingItems } = meetingItem
            const completeMeetingItem = { ...meetingItem, meetingId, parentMeetingItemId: parentMeetingItemId || null }
            const insertMeetingItemQuery = getMeetingItemQuery(completeMeetingItem);
            await this.client.query(insertMeetingItemQuery, async (err, res) => {
                if (err) {
                    logger.error(`unable to create meeting item: ${err}, with query ${insertMeetingItemQuery}`);
                    return;
                }
                const { rows: meetingItem } = res;

                await meetingItem.forEach(async ({ meeting_id, id, order_number, parent_meeting_item_id, created_timestamp }) => {
                    logger.info(
                        `meeting item ${id} of meeting ${meeting_id}, order number ${order_number}, parent_meeting_item_id ${parent_meeting_item_id} successfully created. ` +
                        `meeting created at ${created_timestamp}`
                    )
                    if (nestedMeetingItems) {
                        const parentMeetingItemId = meetingItem[0].id
                        await createMeetingItems(meetingId, nestedMeetingItems, parentMeetingItemId)
                    }
                })

            })
        })
    }

    // TODO, now just manual force quit
    // async function endClient() {
    //     this.client.end()
    // }

    async function printMeetingInfo() {
        await this.client.query("select * from meeting", (err, res) => {
            if (err) {
                logger.error(`Some error querying all your meetings ${err}`);
                return;
            }

            logger.info(`You currently have ${res.rows.length} meeting items`);
        });
    }
}

module.exports = generateMeetingData;
