import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogActivityDocument = HydratedDocument<LogActivity>;

@Schema({ timestamps: true })
export class LogActivity {
  @Prop()
  userId: string;

  @Prop()
  message: string;

  @Prop()
  time: string;

  @Prop()
  type: string;
}

export const LogActivitySchema = SchemaFactory.createForClass(LogActivity);
