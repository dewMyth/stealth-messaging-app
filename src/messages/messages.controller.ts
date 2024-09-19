import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('get-all-messages-by-conversation/:conversationId')
  getAllMessagesByConversation(@Param('conversationId') conversationId) {
    return this.messageService.getAllMessagesByConversation(conversationId);
  }
  @Get('get-messages-for-last-three-days/:userId')
  getMessagesForLastThreeDays(@Param('userId') userId) {
    return this.messageService.getMessagesForLastThreeDays(userId);
  }
}
