import dayjs from 'dayjs';

export function toDateString(timestamp) {
  return dayjs(timestamp).format('M/D/YYYY');
}

export function toTimeString(timestamp) {
  return dayjs(timestamp).format('h:mm A');
}
