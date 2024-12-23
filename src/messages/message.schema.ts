import { Schema, Document } from 'mongoose';

export interface Message extends Document {
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
}

export const MessageSchema = new Schema<Message>({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
