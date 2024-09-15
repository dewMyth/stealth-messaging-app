import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop()
  conversationId: string;

  @Prop()
  senderId: string;

  @Prop()
  text: string;

  @Prop()
  isActive: boolean = true;

  @Prop({ type: Object }) // Use Object for an undefined structure
  messageType: Record<string, any>; // Define it as a record
}

export const MessageSchema = SchemaFactory.createForClass(Message);
