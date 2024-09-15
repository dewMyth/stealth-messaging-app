import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessagesService } from './messages/messages.service';

@Injectable()
export class ScheduleTasksService {
  constructor(private readonly _messageService: MessagesService) {}

  @Cron('*/5 * * * * *') // Runs every minute
  async handleCron() {
    await this._messageService.updateMessageActivity();
    console.log('Checked for expired messages.');
  }
}
