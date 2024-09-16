import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogTypes, MessageTypes } from 'src/types';
import { Message } from './schema/message-schema';
import { Model } from 'mongoose';
import { LogActivityService } from 'src/logs/logs.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private _logActivityService: LogActivityService,
    private _usersService: UsersService,
  ) {}

  getMessage(): string {
    return 'Here is Message';
  }

  async createMessage(messagePaylod) {
    let { conversationId, senderId, text, messageType } = messagePaylod;

    /**
     * messageType : {
     *   messageFunc: messageFunc (string),
     *
     *
     *   For STANDARD messages
     *   funcAttributes: {}
     *
     *   FOR SELF_DESTRUCT_TIMED
     *   funcAttributes: {
     *     to: messageCreatedTimeInTimestamp (Ex: 1726155313)
     *     from: messageCreatedTimeInTimestamp + userDefinedTimePeriod (Ex: 1726155313 + 3600 // 10mins)
     *   }
     *
     *   FOR LIMITED_VIEW_TIME
     *   Check if the  current time is within the funcAttributes.from time
     *   funcAttributes: {
     *     from: userDefined view start time in timestamp (Ex: 2024.09.12 3:00PM in timestamp)
     *     to: userDefined view stop time in timestamp (Ex: 2024.09.13 4:00PM in timestamp)
     *   }
     *
     * }
     *
     * */

    // Assign the message Functionality
    let messageFunc = '';
    let isActive = true;

    let logType;

    switch (messageType.messageFunc) {
      case 0: {
        messageFunc = MessageTypes.STANDARD;
        logType = LogTypes.SENT_STANDARD_MESSAGE;
        break;
      }
      case 1: {
        messageFunc = MessageTypes.SELF_DESTRUCT_TIMED;
        logType = LogTypes.SENT_SELF_DESTRUCT_TIMED_MESSAGE;
        break;
      }
      case 2: {
        messageFunc = MessageTypes.LIMITED_VIEW_TIME;
        logType = LogTypes.SENT_LIMITED_VIEW_TIME_MESSAGE;
        const currentTime = Date.now();
        const { from, to } = messageType.funcAttributes;

        if (currentTime < from || currentTime > to) {
          isActive = false;
        }

        break;
      }
      default:
        throw new Error('Invalid message type');
    }

    // Construct the message object that can be saved
    const newMessage = {
      conversationId,
      senderId,
      text,
      isActive: isActive,
      messageType: {
        messageFunc,
        funcAttributes: messageType.funcAttributes,
      },
    };

    const messageSavedResponse = await this.messageModel
      .create(newMessage)
      .catch((err) => {
        throw new InternalServerErrorException(
          `Unable to save the message. Reason => ${JSON.stringify(err)}`,
        );
      });

    if (!messageSavedResponse._id) {
      throw new Error('Failed to save the message');
    }

    // Log the activity
    const users =
      await this._usersService.getUsersOfAConversation(conversationId);
    const sentUser = users.find((user) => user._id.toString() == senderId);
    const otherUser = users.find((user) => user._id.toString() !== senderId);
    this._logActivityService.createLog(
      senderId,
      `${sentUser.userName} has sent a ${messageFunc} message to ${otherUser.userName}`,
      logType,
    );

    return {
      status: true,
      message: 'Message saved successfully',
      message_id: messageSavedResponse._id,
      conversationId: messageSavedResponse.conversationId, //
    };
  }

  async updateMessageActivity() {
    const currentTime = Math.floor(Date.now() / 1000);

    console.log('Current Time: ' + typeof currentTime);
    console.log('hardcoded', 1726395352);

    // Disable the SELF_DESTRUCT_TIMED messages

    await this.messageModel.updateMany(
      {
        isActive: true,
        'messageType.messageFunc': MessageTypes.SELF_DESTRUCT_TIMED,
        'messageType.funcAttributes.to': { $lte: currentTime },
      },
      { isActive: false },
    );

    // Enable the LIMITED_VIEW_TIME messages if currentTime is within the time limit
    console.log(
      `Start Enabling eligible LIMITED_VIEW_TIME message activity at ${currentTime.toString()}`,
    );
    const ennbleLIMITED_VIEW_TIME = await this.messageModel.find({
      'messageType.messageFunc': 'LIMITED_VIEW_TIME',
      isActive: false,
      'messageType.funcAttributes.from': { $lte: 1726395352 },
      'messageType.funcAttributes.to': { $gte: 1726395352 },
    });
    console.log(
      `Enabling LIMITED_VIEW_TIME will be eligible for ${ennbleLIMITED_VIEW_TIME.length} records.`,
    );
    await this.messageModel.updateMany(
      {
        'messageType.messageFunc': 'LIMITED_VIEW_TIME',
        isActive: false,
        'messageType.funcAttributes.from': { $lte: currentTime },
        'messageType.funcAttributes.to': { $gte: currentTime },
      },
      { isActive: true },
    );
    console.log(
      `Stop Enabling eligible LIMITED_VIEW_TIME message activity at ${currentTime.toString()}`,
    );

    // Disable the LIMITED_VIEW_TIME messages if currentTime is later than the time limit
    console.log(
      `Start Disabling passed LIMITED_VIEW_TIME message activity at ${currentTime.toString()}`,
    );
    const disableLIMITED_VIEW_TIME = await this.messageModel.find({
      isActive: true,
      'messageType.messageFunc': MessageTypes.LIMITED_VIEW_TIME,
      'messageType.funcAttributes.to': { $lte: currentTime },
    });
    console.log(
      `Disabling LIMITED_VIEW_TIME will be eligible for ${disableLIMITED_VIEW_TIME.length} records.`,
    );
    await this.messageModel.updateMany(
      {
        isActive: true,
        'messageType.messageFunc': MessageTypes.LIMITED_VIEW_TIME,
        'messageType.funcAttributes.to': { $lte: currentTime },
      },
      { isActive: false },
    );
    console.log(
      `Stop Disabling passed LIMITED_VIEW_TIME message activity at ${currentTime.toString()}`,
    );
  }

  async getAllMessagesByConversation(conversationdId) {
    const allMessages = await this.messageModel
      .find(
        {
          conversationId: conversationdId,
        },
        {},
        {
          sort: { createdAt: 1 },
        },
      )
      .catch(() => {
        throw new InternalServerErrorException('Could not fetch messages');
      });

    if (allMessages.length == 0) {
      throw new BadRequestException('No messages found');
    }

    return {
      success: true,
      messages: allMessages,
    };
  }
}
