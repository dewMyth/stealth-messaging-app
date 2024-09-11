import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop()
  members: string[] = [];

  @Prop()
  conversationPIN: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);