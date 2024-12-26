import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum MessageStatus {
  SENT = 'Sent',
  DELIVERED = 'Delivered',
  READ = 'Read',
}


@Schema()
export class Status {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  status: string; 
}

@Schema({ timestamps: true }) // Adds createdAt and updatedAt fields automatically
export class Message extends Document {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ required: true, enum: MessageStatus })
  status: MessageStatus;

  // @Prop({ type: [Status], default: [] })
  // status: Status[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);


MessageSchema.index({ sender: 1, recipient: 1, timestamp: 1 });
