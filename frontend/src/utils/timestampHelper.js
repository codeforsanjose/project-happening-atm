import dayjs from 'dayjs';

export function toDateString(timestamp, format) {
  // This function expects Unix timestamp in milliseconds (as String).
  return dayjs(parseInt(timestamp, 10)).format(format || 'M/D/YYYY');
}

export function toTimeString(timestamp) {
  // This function expects Unix timestamp in milliseconds (as String).
  return dayjs(parseInt(timestamp, 10)).format('h:mm A');
}

export function isFutureTimestamp(timestamp) {
  // This function expects Unix timestamp in milliseconds (as String).
  return dayjs().isBefore(dayjs(parseInt(timestamp, 10)));
}

/**
 * Takes an array of meeting objects and groups them by month/year after
 * converting their timestamps.
 *
 * Each meeting object is structured as:
 * {
 *    id,
 *    meeting_start_timestamp: Unix time (milliseconds),
 *    status
 * }
 *
 * @param {Array} meetings List of meeting objects from getAllMeetings query
 * @returns {Array} List of objects organized by year/month and their meetings
 * Example: [
 *    {
 *      year: 2021,
 *      month: "January",
 *      meetings: [...]
 *    },
 *    {
 *      year: 2021,
 *      month: "February",
 *      meetings: [...]
 *    }
 * ]
 */

export function groupMeetingsByDate(meetings) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
  ];
  const groups = {};

  // Fill hash table with meetings organized by year and month
  meetings.forEach((meeting) => {
    const date = dayjs(parseInt(meeting.meeting_start_timestamp, 10));
    const month = date.month();
    const year = date.year();
    const meetingObj = { ...meeting };

    if (groups[year] === undefined) groups[year] = [];
    if (groups[year][month] === undefined) groups[year][month] = [];
    groups[year][month].push(meetingObj);
  });

  // Iterate through all years and push an object for each month
  // that has meetings
  const result = [];
  const sortedYears = Object.keys(groups).sort();

  sortedYears.forEach((year) => {
    const yearMeetings = groups[year];

    for (let i = 0; i < 12; i += 1) {
      if (yearMeetings[i] !== undefined) {
        const sortedMeetings = yearMeetings[i]
          .sort((a, b) =>
            parseInt(a.meeting_start_timestamp, 10) -
            parseInt(b.meeting_start_timestamp, 10)
            );

        const monthObj = {
          year,
          month: months[i],
          meetings: sortedMeetings,
        };
        result.push(monthObj);
      }
    }
  });

  return result;
}

export function getDifference(timestamp, timeUnit) {
  // This function expects Unix timestamp in milliseconds (as String).
  // 'timeUnit' is unit used to calculate the difference between the current time and the given one.
  // More details can be found at https://day.js.org/docs/en/display/difference.
  const now = dayjs();
  return dayjs(parseInt(timestamp, 10)).diff(now, timeUnit || 'day');
}
