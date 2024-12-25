import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageStatus } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) { }

  // Create a new message in the db
  async createMessage(data: { sender: string; recipient: string; content: string }): Promise<Message> {
    if (!data.sender || !data.recipient || !data.content) {
      throw new Error('Sender, recipient, and content are required.');
    }
    const message = new this.messageModel({ ...data, status: MessageStatus.SENT });
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

  // Store undelivered message
  async storeUndeliveredMessage(_id: string) {
    try {
      // Update the status of the specific deviceId in the message
      const result = await this.messageModel.updateOne(
        {
          _id: _id,
        },
        {
          $set: {
            "status": MessageStatus.SENT
          },
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error('No matching message or deviceId found to update.');
      }

      return { message: 'Message status updated successfully' };
    } catch (error) {
      throw new Error(`Error updating message status: ${error.message}`);
    }
  }

  async updateMessageStatus(messageId: string, userId: string, status: MessageStatus) {
    try {
      const message = await this.messageModel.findOne({_id : messageId, recipient : userId});
      if (!message) {
        throw new Error('Message not found');
      }
      message.status = status;
      await message.save();
      return { message: 'Message status updated successfully' };
    } catch (error) {
      throw new Error(`Error updating message status: ${error.message}`);
    }
  }

  async getUndeliveredMessages(userId: string, loggedUserId: string): Promise<Message[]> {
    return this.messageModel.find({
      sender: userId,
      recipient: loggedUserId,
      status: MessageStatus.SENT, 
    });
  }
}
