import { Socket } from 'socket.io';
import { MessagesService } from './messages.service';
export declare class MessagesGateway {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(data: {
        sender: string;
        recipient: string;
        content: string;
    }, client: Socket): Promise<void>;
}
