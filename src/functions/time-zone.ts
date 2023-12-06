import { tz } from 'moment-timezone';

export function transformTimeZoneInString(inputString: string, inputFormat: string, timeZone: string) {
  return tz(inputString, inputFormat, timeZone).format(inputFormat);
}

export function transformTimeZoneInTimestamp(timestamp: number, format: string, timeZone: string) {
  return tz(timestamp, timeZone).format(format);
}
