import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Http2ServerResponse } from 'http2';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/users/schema/user-schema';
import { UsersService } from 'src/users/users.service';
import { UtilService } from 'src/util.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private _utilService: UtilService,
    private _emailService: EmailService,
    private _userService: UsersService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async signUp(newUser) {
    // Check if the user already exists using email
    const isUserAlreadyExists = await this.userModel
      .findOne({
        email: newUser.email,
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Error while finding existng user.Reason: ${err.message}`,
        );
      });

    if (isUserAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    // If not continue

    // Hash the password using bcrypt - (Encryption - Bcrypt)
    let saltRounds = 10;
    var encryptedPassword = await bcrypt.hash(newUser.password, saltRounds);

    console.log(encryptedPassword);

    // Store the user in the database with isVerified false and with a generated code
    const sixDigitCode = this._utilService.generateSixDigitCode();

    // Construct the final payload that will be used to save in the db
    let finalUser = {
      email: newUser.email,
      userName: newUser.userName,
      password: encryptedPassword,
      isVerified: false,
      verificationCode: sixDigitCode,
    };

    // Save the user in the database
    const response = await this.userModel.create(finalUser).catch((err) => {
      throw new InternalServerErrorException(
        `Error while saving user. Reason: ${err.message}`,
      );
    });

    // Send a verification email to the user with a generated CODE
    if (response._id) {
      await this._emailService
        .sendVerificationEmail(
          finalUser.email,
          finalUser.userName,
          finalUser.verificationCode,
        )
        .catch((err) => console.log(err));
    } else {
      throw new InternalServerErrorException(
        `Error while sending verification email for user - ${finalUser.userName} : ${finalUser.email}`,
      );
    }

    return {
      status: HttpStatus.CREATED,
      message: `User - ${finalUser.userName} : ${finalUser.email} signed up successfully. Please verify your email.`,
    };
  }

  async signIn(loginCredentials) {
    const { email, password } = loginCredentials;

    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException(`No user with the relevant email`);
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new BadRequestException('Incorrect password');
    }

    return {
      status: HttpStatus.OK,
      message: `User - ${user.userName} : ${user.email} logged in successfully.`,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }
}
