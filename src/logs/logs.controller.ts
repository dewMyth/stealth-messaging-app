import { Controller, Get, Param } from '@nestjs/common';
import { LogActivityService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logActicityService: LogActivityService) {}

  @Get('get-all-logs-by-user/:userId')
  getAllLogsByUser(@Param('userId') userId: string) {
    return this.logActicityService.getAllLogsByUser(userId);
  }
}
