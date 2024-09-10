import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  getMessage(): string {
    return 'Here is Message';
  }
}
