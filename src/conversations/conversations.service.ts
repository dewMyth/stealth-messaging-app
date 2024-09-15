import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schema/conversation-schema';
import { UtilService } from 'src/util.service';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private _utilService: UtilService,
    private _usersService: UsersService,
    private _emailService: EmailService,
  ) {}

  async getConversation(id) {
    const conversation = await this.conversationModel
      .findById(id)
      .catch((err) => {
        throw new InternalServerErrorException(
          `Failed to fetch conversation: ${err.message}`,
        );
      });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return {
      _id: conversation._id,
      members: conversation.members,
      conversationPIN: conversation.conversationPIN,
    };
  }

  async createConversation(conversationInput) {
    const { members } = conversationInput;

    if (members.length == 0) {
      throw new BadRequestException(
        `Something is wrong with creating conversation`,
      );
    }

    // Check whether the conversation with those members already exists
    const existingConversation = await this.conversationModel
      .findOne({
        members: { $all: members },
        isActive: true,
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Error while finding existing conversation. Reason: ${err.message}`,
        );
      });

    if (existingConversation) {
      // Check if conversation is removed, then re-enable
      if (existingConversation.isRemoved) {
        existingConversation.isActive = true;
        existingConversation.isRemoved = false;
        await existingConversation.save();
        return {
          success: true,
          message: `Conversation found earlier. Re-Enabled it successfully!`,
        };
      } else {
        throw new Error('Conversation already exists');
      }
    }

    const newConversation = {
      members: members,
      conversationPIN: this._utilService.generateSixDigitCode(),
      isRemoved: false,
      isActive: true,
    };

    const newConversationResponse = await this.conversationModel
      .create(newConversation)
      .catch(() => {
        throw new InternalServerErrorException('Could not create conversation'); //
      });

    if (newConversationResponse._id) {
      // Send Email to both users

      // Get Emails of both users
      let users = await this._usersService.getUsersByIds(members);
      let emails = users.map((user) => user.email);

      // Send Email to both users
      users.map(async (user) => {
        await this._emailService.conversationPINEmail(
          user.email,
          user.userName,
          newConversation.conversationPIN,
          emails.filter((email) => email !== user.email),
        );
      });
    }

    return {
      success: true,
      message: `Conversation is created successfully!`,
    };
  }

  async getAllConversationsByUser(id) {
    let convList = await this.conversationModel
      .find({
        members: { $in: [id] },
        isActive: true,
        isRemoved: false,
      })
      .catch((error) => {
        throw new InternalServerErrorException(
          `Failed to fetch conversations for user => ${id}: Reason : ${error.message}`,
        );
      });

    if (convList.length == 0) {
      return {
        success: true,
        message: 'No conversations found for this user',
      };
    }

    let cleanedConvList = [];

    convList.forEach((conv) => {
      cleanedConvList.push({
        _id: conv._id,
        isActive: conv.isActive,
        members: conv.members,
      });
    });

    return {
      success: true,
      message: 'Conversations fetched successfully',
      conversations: cleanedConvList,
    };
  }

  async unlockConversation(conversationCredentials) {
    const { conversationId, enteredPIN } = conversationCredentials;

    if (!conversationId || !enteredPIN) {
      throw new BadRequestException(
        'Please provide conversation ID and entered PIN',
      );
    }

    const conversation = await this.getConversation(conversationId);

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    if (conversation.conversationPIN! !== enteredPIN) {
      throw new BadRequestException('Incorrect PIN entered');
    }

    return {
      success: true,
      isUnlocked: true,
      message: 'Conversation unlocked successfully',
    };
  }

  async deleteConversation(conversationId: string) {
    const shouldDeleteConversation =
      await this.conversationModel.findById(conversationId);

    if (shouldDeleteConversation.isActive == false) {
      throw new BadRequestException('Conversation is already disabled');
    }

    await this.conversationModel.findByIdAndUpdate(
      shouldDeleteConversation._id,
      { isRemoved: true },
      { new: true },
    );

    return {
      success: true,
      message: 'Conversation deleted successfully',
    };
  }

  async getDeletedConversations(userId: string) {
    const deletedConversations = await this.conversationModel
      .find({ members: { $in: [userId] }, isRemoved: true })
      .catch((error) => {
        throw new InternalServerErrorException(
          `Failed to fetch deleted conversations for user => ${userId}: Reason : ${error.message}`,
        );
      });

    return deletedConversations;
  }
}
