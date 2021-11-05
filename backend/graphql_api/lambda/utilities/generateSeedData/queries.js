const { format } = require('date-fns')

const DATE_FORMAT = 'yyyy-MM-dd'
// TODO: find library that has more readable string replacement

// similar code to query & dbClient, but didn't re-use since dbClient was graphql specific
// could have tried to create through graphql but wanted something separated from it, so could be reusable/used as is
const getMeetingQuery = (
  meeting
) => {
  const { meeting_type,
    meeting_start_timestamp,
    virtual_meeting_url,
    status,
    virtual_meeting_id,
    call_in_information,
    email_before_meeting,
    email_during_meeting,
    ecomment,
    city_of_san_jose_meeting,
    youtube_link } = meeting;

  return `INSERT INTO meeting(meeting_type, meeting_start_timestamp, virtual_meeting_url, created_timestamp, updated_timestamp, status, virtual_meeting_id, call_in_information, email_before_meeting, email_during_meeting, ecomment, city_of_san_jose_meeting, youtube_link)
    VALUES (
      ${meeting_type},
      ${meeting_start_timestamp},
      ${virtual_meeting_url},
      '${format(new Date(), DATE_FORMAT)}',
      '${format(new Date(), DATE_FORMAT)}',
      ${status},
      ${virtual_meeting_id},
      ${call_in_information},
      ${email_before_meeting},
      ${email_during_meeting},
      ${ecomment},
      ${city_of_san_jose_meeting},
      ${youtube_link}
    ) RETURNING id, meeting_type, created_timestamp;`;
};

const getMeetingItemQuery = (
  meetingItem
) => {
  const {
    meetingId, // get from parent
    orderNumber,
    itemStartTimestamp,
    itemEndTimestamp,
    status,
    descriptionLocKey,
    contentCategories,
    titleLocKey,
    // if meeting_item is nested, reference parent meeting_item
    parentMeetingItemId,
  } = meetingItem
  const now = Date.now();
  const createdTimestamp = format(now, DATE_FORMAT);
  const updatedTimestamp = format(now, DATE_FORMAT);

  return `INSERT INTO meeting_item(meeting_id, order_number, created_timestamp, updated_timestamp,
    item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key,
    title_loc_key, parent_meeting_item_id)
  VALUES (${meetingId}, ${orderNumber}, '${createdTimestamp}', '${updatedTimestamp}', ${itemStartTimestamp}, ${itemEndTimestamp},
    ${status}, ${contentCategories}, ${descriptionLocKey}, ${titleLocKey}, ${parentMeetingItemId})
  RETURNING id, meeting_id, order_number, parent_meeting_item_id, created_timestamp;`};

module.exports = {
  getMeetingQuery,
  getMeetingItemQuery
}