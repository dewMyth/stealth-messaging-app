import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsService {
  getConversation(): string {
    return 'Here is a conversation';
  }
}
