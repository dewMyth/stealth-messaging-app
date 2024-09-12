import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get('get-message-by-id')
  getMessage() {
    return this.messageService.getMessage();
  }

  @Post('create-message')
  createMessage(@Body() messagePayload) {
    return this.messageService.createMessage(messagePayload);
  }
}
