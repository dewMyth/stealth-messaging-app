import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  generateSixDigitCode() {
    // Generate a random number between 100000 and 999999 (inclusive)
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
