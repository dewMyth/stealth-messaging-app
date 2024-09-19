import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user-schema';
import { Model } from 'mongoose';
import { LogActivity } from 'src/logs/schema/logs.schema';
import { LogActivityService } from 'src/logs/logs.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { LogTypes } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private _logActivityService: LogActivityService,
    private _conversationService: ConversationsService,
  ) {}

  getUser(): string {
    return 'User is Dewmith';
  }

  async getUserByEmail(email) {
    const user = await this.userModel.findOne({ email: email }).catch((err) => {
      throw new InternalServerErrorException(
        `Failed to fetch user: ${err.message}`,
      );
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserById(id) {
    const user = await this.userModel.findById(id).catch((err) => {
      throw new InternalServerErrorException(
        `Failed to fetch user: ${err.message}`,
      );
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async verifyUser(verifiedUserPayload) {
    const { email, verificationCode } = verifiedUserPayload;

    const user = await this.getUserByEmail(email).catch((err) => {
      throw new BadRequestException(`Failed to verify user: ${err.message}`);
    });

    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException('Verification code does not match');
    } else {
      user.isVerified = true;
      user.verificationCode = null;
      await user.save();
    }

    this._logActivityService.createLog(
      user._id,
      'User email is verified',
      LogTypes.USER_VERIFIED,
    );

    return {
      status: HttpStatus.OK,
      message: 'User verified successfully',
    };
  }

  async getUsersByIds(ids) {
    const users = await this.userModel
      .find({
        _id: {
          $in: ids,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Could not fetch users'); //
      });

    return users;
  }

  async getAllUsers() {
    const users = await this.userModel.find().catch((err) => {
      throw new InternalServerErrorException(
        `Failed to fetch users: ${err.message}`,
      );
    });

    return users;
  }

  async getUsersOfAConversation(conversationdId) {
    const conversation =
      await this._conversationService.getConversation(conversationdId);

    const userIds = conversation.members;

    // Get users with the conversation
    const users = await this.getUsersByIds(userIds);

    return users;
  }

  async changeStealthModeByUserId(data) {
    const { userId } = data;

    const findUser = await this.userModel.findById(userId).catch((err) => {
      throw new InternalServerErrorException(
        `Failed to fetch user: ${err.message}`,
      );
    });

    if (!findUser) {
      throw new Error('User not found');
    }

    const response = await this.userModel
      .updateOne(
        { _id: userId },
        { $set: { isStealthMode: !findUser.isStealthMode } },
        { new: true },
      )
      .catch((err) => {
        throw new InternalServerErrorException(
          `Failed to change stealth mode: ${err.message}`,
        );
      });

    if (!response) {
      throw new Error('Failed to change stealth mode');
    }

    return {
      status: HttpStatus.OK,
      message:
        response.modifiedCount !== 0
          ? 'Stealth mode changed successfully'
          : 'No changes made',
    };
  }
}
