import { DateTime } from "luxon";

export const encodeDate = (date: DateTime) => {
  return date.toISO();
};

export const decodeDate = (date: string) => {
  return DateTime.fromISO(date);
};
