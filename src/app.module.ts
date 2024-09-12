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
import { UtilService } from './util.service';
import { EmailService } from './email/email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/schema/user-schema';
import {
  Conversation,
  ConversationSchema,
} from './conversations/schema/conversation-schema';
import { Message, MessageSchema } from './messages/schema/message-schema';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleTasksService } from './schedule-tasks.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dewmythdev:12345678abcdef@cluster0.xzp4w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
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
    UtilService,
    EmailService,
    ScheduleTasksService,
  ],
})
export class AppModule {}
