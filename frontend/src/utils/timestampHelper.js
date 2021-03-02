import dayjs from 'dayjs';

export function toDateString(timestamp, format) {
  return dayjs(timestamp).format(format || 'M/D/YYYY');
}

export function toTimeString(timestamp) {
  return dayjs(timestamp).format('h:mm A');
}

function getTimeStampForDayJS(unixTimeString) {
  return parseInt(unixTimeString, 10) / 1000;
}

export function unixTimeStringToDateString(unixTimeString, format) {
  return toDateString(getTimeStampForDayJS(unixTimeString), format);
}

export function unixTimeStringToTimeString(unixTimeString) {
  return toTimeString(getTimeStampForDayJS(unixTimeString));
}

export function isFutureTimestamp(timestamp) {
  const unixTime = getTimeStampForDayJS(timestamp);
  return dayjs().isBefore(unixTime);
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
    const unixTime = getTimeStampForDayJS(meeting.meeting_start_timestamp);
    const date = dayjs(unixTime);
    const month = date.month();
    const year = date.year();
    const meetingObj = { ...meeting };
    meetingObj.meeting_start_timestamp = unixTime;

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
          .sort((a, b) => a.meeting_start_timestamp - b.meeting_start_timestamp);

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

export function getRelativeTimeLocKey(unixTimeString) {
  // This function expects a unix time divided by 1000 (milliseconds converted to seconds).
  // Returns a locale key for a meeting status (relative to the current time).
  if (isFutureTimestamp(unixTimeString)) {
    const locKeyPrefix = 'meeting.status.relative.long.';
    const dayJSTimeStamp = dayjs(getTimeStampForDayJS(unixTimeString));
    const now = dayjs();
    const diffInDays = dayJSTimeStamp.diff(now, 'day');
    if (diffInDays > 6) {
      return `${locKeyPrefix}in-1-week`;
    }
    return `${locKeyPrefix}in-${diffInDays}-day${diffInDays <= 1 ? '' : 's'}`;
  }
  return 'meeting.status.long.ended';
}
