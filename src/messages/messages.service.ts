import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MessageTypes } from 'src/types';
import { Message } from './schema/message-schema';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
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

    switch (messageType.messageFunc) {
      case 0: {
        messageFunc = MessageTypes.STANDARD;
        break;
      }
      case 1: {
        messageFunc = MessageTypes.SELF_DESTRUCT_TIMED;
        break;
      }
      case 2: {
        messageFunc = MessageTypes.LIMITED_VIEW_TIME;
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

    return {
      status: true,
      message: 'Message saved successfully',
      message_id: messageSavedResponse._id,
    };
  }

  async updateMessageActivity() {
    const currentTime = Date.now();

    // Disable the SELF_DESTRUCT_TIMED messages
    console.log(
      `Start updating SELF_DESTRUCT_TIMED message activity at ${currentTime.toString()}`,
    );
    await this.messageModel.updateMany(
      {
        isActive: true,
        'messageType.messageFunc': MessageTypes.SELF_DESTRUCT_TIMED,
        'messageType.funcAttributes.to': { $lte: currentTime },
      },
      { isActive: false },
    );
    console.log(
      `End updating Self destruct message activity at ${currentTime.toString()}`,
    );

    // Enable the LIMITED_VIEW_TIME messages if currentTime is within the time limit
    console.log(
      `Start Enabling eligible LIMITED_VIEW_TIME message activity at ${currentTime.toString()}`,
    );
    const ennbleLIMITED_VIEW_TIME = await this.messageModel.find({
      isActive: false,
      'messageType.messageFunc': MessageTypes.LIMITED_VIEW_TIME,
      'messageType.funcAttributes.from': { $lte: currentTime },
    });
    console.log(
      `Enabling LIMITED_VIEW_TIME will be eligible for ${ennbleLIMITED_VIEW_TIME.length} records.`,
    );
    await this.messageModel.updateMany(
      {
        isActive: false,
        'messageType.messageFunc': MessageTypes.LIMITED_VIEW_TIME,
        'messageType.funcAttributes.from': { $lte: currentTime },
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
}
