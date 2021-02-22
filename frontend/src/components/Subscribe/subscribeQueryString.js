const SUBSCRIPTION_QUERY_PARAM_NAME = 'items';

/**
 * Takes selectedItems as an Object like
 * {
 *   [meeting_id]: { [meeting_item_id] }
 * }
 * and returns a query string like
 * ?[meeting_id]:[meeting_item_id],[another_meeting_item_id]
 */
export function buildSubscriptionQueryString(selectedItems) {
  const subscriptionQueryString = new URLSearchParams();
  Object.keys(selectedItems).forEach((meetingId) => {
    subscriptionQueryString.append(
      SUBSCRIPTION_QUERY_PARAM_NAME,
      `${meetingId}:${Object.keys(selectedItems[meetingId]).join(',')}`,
    );
  });
  return subscriptionQueryString.toString();
}

/**
 * Takes a query string like
 * ?[meeting_id]:[meeting_item_id],[another_meeting_item_id]
 * and returns an array of objects consisting `meeting_id` and `meeting_item_id`:
 * [{
 *   meeting_id: 1,
 *   meeting_item_id: 1
 *  }, ...
 * ]
 */
export function convertQueryStringToServerFormat(queryString) {
  const searchParams = new URLSearchParams(queryString);
  const meetings = [];
  searchParams.getAll(SUBSCRIPTION_QUERY_PARAM_NAME).forEach((itemsElement) => {
    const meetingParams = itemsElement.split(':');
    meetingParams[1].split(',').forEach((meetingItemId) => {
      meetings.push({
        meeting_id: parseInt(meetingParams[0], 10),
        meeting_item_id: parseInt(meetingItemId, 10),
      });
    });
  });
  return meetings;
}
