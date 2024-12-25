import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) { }

  // Create a new message in the db
  async createMessage(data: { sender: string; recipient: string; content: string, deviceId: string }): Promise<Message> {
    if (!data.sender || !data.recipient || !data.content) {
      throw new Error('Sender, recipient, and content are required.');
    }
    const message = new this.messageModel({ ...data, status: [{ deviceId: data.deviceId, status: "sent" }] });
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
  async storeUndeliveredMessage(_id: string, deviceId: string) {
    try {
      // Update the status of the specific deviceId in the message
      const result = await this.messageModel.updateOne(
        {
          _id: _id,
          "status.deviceId": deviceId, // Find the specific status by deviceId
        },
        {
          $set: {
            "status.$.status": "sent", // Update only the matched element in the status array
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

  async updateMessageStatus(messageId: string, deviceId: string, status: string) {
    try {
      const message = await this.messageModel.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      const existingStatus = message.status.find(s => s.deviceId === deviceId);

      if (existingStatus) {
        existingStatus.status = status;
      } else {
        message.status.push({ deviceId, status });
      }

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
      'status.status': 'sent', // 'sent' status means the message is undelivered
    });
  }
}
