import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogActivity } from './schema/logs.schema';
import { Model } from 'mongoose';

@Injectable()
export class LogActivityService {
  constructor(
    @InjectModel(LogActivity.name)
    private logActivityModel: Model<LogActivity>,
  ) {}

  async getAllLogsByUser(userId) {
    return await this.logActivityModel.find({ userId }).exec();
  }

  // logData
  async createLog(userId, message, type) {
    const newLog = new this.logActivityModel({
      userId: userId,
      message: message,
      type: type,
      time: new Date().toISOString(),
    });
    return await newLog.save();
  }
}
