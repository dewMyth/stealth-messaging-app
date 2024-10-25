import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  userName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  isVerified: boolean = false;

  @Prop()
  verificationCode: string;

  @Prop()
  isStealthMode: boolean = false;
}

export const UserSchema = SchemaFactory.createForClass(User);
