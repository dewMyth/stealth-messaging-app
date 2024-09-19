import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  generateSixDigitCode() {
    // Generate a random number between 100000 and 999999 (inclusive)
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  converToFriendlyDate = (dateInGMT) => {
    const date = new Date(dateInGMT);

    // Convert to GMT+5:30 by adjusting the time zone offset
    const offsetInMilliseconds = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const localDateTime = new Date(date.getTime() + offsetInMilliseconds);

    // Format the result
    const locatDateTimeInISOString = localDateTime.toISOString();
    console.log(locatDateTimeInISOString);

    // return locatDateTimeInISOString;

    const finalDate = new Date(locatDateTimeInISOString);
    return finalDate.toISOString();
  };

  getPreviousDatesStartAndEndTimes = () => {
    // Get current date
    const now = new Date();

    // Calculate yesterday's date
    const today = new Date(now);
    today.setDate(now.getDate());

    // Set the start time to 00:00:00.000Z
    const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();

    // Set the end time to 23:59:59.999Z
    const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    // Calculate yesterday's date
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    // Set the start time to 00:00:00.000Z
    const startOfYesterday = new Date(
      yesterday.setHours(0, 0, 0, 0),
    ).toISOString();

    // Set the end time to 23:59:59.999Z
    const endOfYesterday = new Date(
      yesterday.setHours(23, 59, 59, 999),
    ).toISOString();

    // Get current date
    // const now = new Date();

    // Calculate the date two days ago
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);

    // Set the start time to 00:00:00.000Z
    const startOfTwoDaysAgo = new Date(
      twoDaysAgo.setHours(0, 0, 0, 0),
    ).toISOString();

    // Set the end time to 23:59:59.999Z
    const endOfTwoDaysAgo = new Date(
      twoDaysAgo.setHours(23, 59, 59, 999),
    ).toISOString();

    let finalstartOfToday = utcToLocal(startOfToday);
    let finalEndOfToday = utcToLocal(endOfToday);
    let fianlStartOfYesterday = utcToLocal(startOfYesterday);
    let fianlEndOfYesterday = utcToLocal(endOfYesterday);
    let fianlStartOfTwoDaysAgo = utcToLocal(startOfTwoDaysAgo);
    let fianlEndOfTwoDaysAgo = utcToLocal(endOfTwoDaysAgo);

    return {
      finalstartOfToday,
      finalEndOfToday,
      fianlStartOfYesterday,
      fianlEndOfYesterday,
      fianlStartOfTwoDaysAgo,
      fianlEndOfTwoDaysAgo,
    };
  };
}

const utcToLocal = (utcDateStr) => {
  const date = new Date(utcDateStr);
  const options = { timeZone: 'Asia/Colombo', hour12: false };
  return date.toLocaleString('en-US', options);
};
