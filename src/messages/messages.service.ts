import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

   // Create a new message in the db
  async createMessage(data: { sender: string; recipient: string; content: string }): Promise<Message> {
    if (!data.sender || !data.recipient || !data.content) {
      throw new Error('Sender, recipient, and content are required.');
    }
    const message = new this.messageModel(data);
    return message.save();
  }

  // Get messages between sender and recipient
  async getMessages(sender: string, recipient: string): Promise<Message[]> {
    return this.messageModel.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 }); // Sorting by timestamp to get messages in order
  }
}
