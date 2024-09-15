import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('get-conversation-by-id/:conversationId')
  getUser(@Param('conversationId') conversationId) {
    return this.conversationsService.getConversation(conversationId);
  }

  @Post('create-conversation')
  createConversation(@Body() conversationInput) {
    return this.conversationsService.createConversation(conversationInput);
  }

  @Get('get-all-conversation-by-user/:userId')
  getAllConversationsByUser(@Param('userId') userId) {
    return this.conversationsService.getAllConversationsByUser(userId);
  }

  @Post('unlock-conversation')
  unlockConversation(@Body() unlockCredentials) {
    return this.conversationsService.unlockConversation(unlockCredentials);
  }

  @Post('delete-conversation')
  deleteConversation(@Body() data) {
    const { conversationId } = data;
    return this.conversationsService.deleteConversation(conversationId);
  }

  @Get('deleted-conversations/:userId')
  getDeletedConversations(@Param('userId') userId) {
    return this.conversationsService.getDeletedConversations(userId);
  }
}
