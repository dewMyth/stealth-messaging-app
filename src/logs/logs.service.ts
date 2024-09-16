import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogActivity } from './schema/logs.schema';
import { Model } from 'mongoose';
import { UtilService } from 'src/util.service';

@Injectable()
export class LogActivityService {
  constructor(
    @InjectModel(LogActivity.name)
    private logActivityModel: Model<LogActivity>,
    private _utilService: UtilService,
  ) {}

  async getAllLogsByUser(userId) {
    const logs = await this.logActivityModel
      .find(
        { userId },
        {},
        {
          sort: { time: -1 }, // sort in descending order of time
        },
      )
      .exec();

    if (logs.length == 0) {
      return { message: 'No logs found for this user' };
    }

    return logs;
  }

  // logData
  async createLog(userId, message, type) {
    const newLog = new this.logActivityModel({
      userId: userId,
      message: message,
      type: type,
      time: this._utilService.converToFriendlyDate(new Date().toISOString()),
    });
    return await newLog.save();
  }
}
