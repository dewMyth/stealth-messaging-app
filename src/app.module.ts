import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { MessagesService } from './messages/messages.service';
import { ConversationsService } from './conversations/conversations.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ConversationsController } from './conversations/conversations.controller';
import { MessagesController } from './messages/messages.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    UsersController,
    AuthController,
    ConversationsController,
    MessagesController,
  ],
  providers: [
    AppService,
    UsersService,
    MessagesService,
    ConversationsService,
    AuthService,
  ],
})
export class AppModule {}
