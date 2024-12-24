import { Schema, Document } from 'mongoose';

// Define the Message interface for TypeScript type safety
export interface Message extends Document {
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
}

// Define the Message Schema with options and validation
export const MessageSchema = new Schema<Message>({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  content: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Indexing for faster queries
MessageSchema.index({ sender: 1, recipient: 1, timestamp: 1 });

