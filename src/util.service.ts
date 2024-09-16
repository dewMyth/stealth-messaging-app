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
}
