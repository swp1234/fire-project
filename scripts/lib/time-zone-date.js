'use strict';

const DEFAULT_TIME_ZONE = 'Asia/Seoul';

function dateInTimeZone(value = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`Invalid date: ${value}`);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function todayInTimeZone(timeZone = DEFAULT_TIME_ZONE) {
  return dateInTimeZone(new Date(), timeZone);
}

module.exports = {
  DEFAULT_TIME_ZONE,
  dateInTimeZone,
  todayInTimeZone,
};
