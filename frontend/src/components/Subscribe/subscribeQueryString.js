const SUBSCRIPTION_QUERY_PARAM_NAME = 'items';

/**
 * Takes selectedItems as an Object like
 * {
 *   [meeting_id]: { [meeting_item_id] }
 * }
 * and returns a query string like
 * ?items=[meeting_item_id],[another_meeting_item_id]
 * like
 * ?items=1,3,5
 */
export function buildSubscriptionQueryString(selectedItems) {
  const subscriptionQueryString = new URLSearchParams();
  Object.keys(selectedItems).forEach((meetingId) => {
    subscriptionQueryString.append(
      SUBSCRIPTION_QUERY_PARAM_NAME,
      `${Object.keys(selectedItems[meetingId]).join(',')}`,
    );
  });
  return subscriptionQueryString.toString();
}

/**
 * Takes a query string like
 * ?items=[meeting_item_id],[another_meeting_item_id]
 * and returns an array of objects consisting `meeting_item_id`:
 * [{
 *   meeting_item_id: 1
 *  }, ...
 * ]
 */
export function convertQueryStringToServerFormat(queryString) {
  const searchParams = new URLSearchParams(queryString);
  const meetingItems = [];
  searchParams.getAll(SUBSCRIPTION_QUERY_PARAM_NAME).forEach((itemsElement) => {
    itemsElement.split(',').forEach((meetingItemId) => {
      meetingItems.push({
        meeting_item_id: parseInt(meetingItemId, 10),
      });
    });
  });
  return meetingItems;
}
