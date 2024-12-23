import { Model } from 'mongoose';
import { Message } from './message.schema';
export declare class MessagesService {
    private readonly messageModel;
    constructor(messageModel: Model<Message>);
    createMessage(data: {
        sender: string;
        recipient: string;
        content: string;
    }): Promise<Message>;
    getMessages(sender: string, recipient: string): Promise<Message[]>;
}
