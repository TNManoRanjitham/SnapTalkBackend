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
import { MessageStatus } from './message.schema';

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


  @ApiOperation({ summary: 'Send a message via WebSocket' })
  @ApiBody({ type: SendMessageDto, description: 'Payload for sending a message' })
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { sender: string; recipient: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Sent Message Received:', data);
    const message = await this.messagesService.createMessage(data);

    // Emit the message to the sender
    client.emit('receive_message', { ...data, _id : message._id.toString(), timestamp: new Date().toISOString() } as ReceiveMessageDto);

    // Check if the recipient is online
    const recipientSocket = this.activeUsers.get(data.recipient);
    
    if (recipientSocket) {
      console.log('Publish receive_message event to the recipient', data.recipient);
      recipientSocket.emit('receive_message', { ...data, _id : message._id.toString(), timestamp: new Date().toISOString() } as ReceiveMessageDto);
    } else {
      console.log(`Recipient ${data.recipient} is not connected`);
      await this.messagesService.storeUndeliveredMessage(message._id.toString());

    }
  }

  // Endpoint to trigger undelivered messages for a user
  @SubscribeMessage('fetch_undelivered_messages')
  async fetchUndeliveredMessages(
    @MessageBody() { recipient, loggedUserId }: { recipient: string, loggedUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('Fetching undelivered messages for:', recipient);

      // Fetch undelivered messages from the database
      const undeliveredMessages = await this.messagesService.getUndeliveredMessages(recipient, loggedUserId);

      if (undeliveredMessages.length > 0) {
        console.log(`Sending undelivered messages to ${loggedUserId}`);

        undeliveredMessages.forEach((message) => {
          const recipientSocket = this.activeUsers.get(loggedUserId);

          if (recipientSocket) {
            client.emit('receive_message', {
              _id: message._id.toString(),
              sender: recipient,
              recipient: loggedUserId,
              content: message.content,
              timestamp: new Date().toISOString(),
            });
            
            // message.status.forEach((status) => {
            //   if (status.deviceId) {
            //     this.messagesService.updateMessageStatus(message._id.toString(), status.deviceId, 'delivered');
            //   }
            // });
          } else {
            console.log(`Recipient ${loggedUserId} is not online`);
          }
        });
      } else {
        console.log('No undelivered messages found for', recipient);
      }
    } catch (error) {
      console.error('Error fetching undelivered messages:', error);
    }
  }

  @ApiOperation({ summary: 'Handle message delivered event' })
  @SubscribeMessage('message_delivered')
  async handleDeliveredMessage(
    @MessageBody() { messageId, userId }: { messageId: string; userId: string },
  ) {
    try {
      console.log('Message delivered  event received:', messageId);
      await this.messagesService.updateMessageStatus(messageId, userId, MessageStatus.DELIVERED);
    } catch (error) {
      console.error('Error updating message status to delivered:', error);
    }
  }
}
