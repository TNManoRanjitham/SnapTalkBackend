import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { SendMessageDto, ReceiveMessageDto } from './messages.dto';

@ApiTags('WebSocket')
@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const frontendUrl = process.env.FRONTEND_URL;
      if (origin === frontendUrl || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
  },
})
export class MessagesGateway {
  // Make activeUsers an instance variable of the class
  private activeUsers = new Map<string, Socket>();

  constructor(private readonly messagesService: MessagesService) { }

  // Handles a new connection by associating the userId with the connected socket
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, client);
      console.log(`User connected: ${userId}`);
    } else {
      console.log('A client connected without a userId');
    }
  }

  // Cleans up when a client disconnects
  handleDisconnect(client: Socket) {
    const userId = [...this.activeUsers.entries()].find(([_, socket]) => socket.id === client.id)?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    }
  }

  // Handles incoming messages and routes them to the appropriate recipients
  @ApiOperation({ summary: 'Send a message via WebSocket' })
  @ApiBody({ type: SendMessageDto, description: 'Payload for sending a message' })
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { sender: string; recipient: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Message received:', data);

    const message = await this.messagesService.createMessage(data);

    // Emit the message to the sender
    client.emit('receive_message', { ...data, timestamp: new Date().toISOString() } as ReceiveMessageDto);

    // Check if the recipient is online
    const recipientSocket = this.activeUsers.get(data.recipient);
    if (recipientSocket) {
      recipientSocket.emit('receive_message', { ...data, timestamp: new Date().toISOString() } as ReceiveMessageDto);
    } else {
      console.log(`Recipient ${data.recipient} is not connected`);
    }
  }
}
