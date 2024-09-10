import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user-schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

    return {
      status: HttpStatus.OK,
      message: 'User verified successfully',
    };
  }
}
