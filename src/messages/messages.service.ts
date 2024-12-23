import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';
import { send } from 'process';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(data: { sender: string; recipient: string; content: string }): Promise<Message> {
    const message = new this.messageModel(data);
    return message.save();
  }

  async getMessages(sender: string, recipient: string): Promise<Message[]> {
    return this.messageModel.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 });
  }
}
