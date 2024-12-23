import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { MessagesService } from './messages.service';

  // Map to track active users and their corresponding socket connections
  const activeUsers = new Map<string, Socket>(); 
  
  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:3001', // Frontend server URL for cross-origin requests
      methods: ['GET', 'POST'],
    },
  })
  export class MessagesGateway {
    constructor(private readonly messagesService: MessagesService) {}
  
    // Handles a new connection by associating the userId from the query string with the connected socket
    handleConnection(client: Socket) {
      const userId = client.handshake.query.userId as string; // User ID passed during connection
      if (userId) {
        // This ensures we can send messages to the correct socket when needed
        activeUsers.set(userId, client); // Map userId to the client's socket
        console.log(`User connected: ${userId}`);
      }else
      {
        // Edge case: If no userId is provided, the client cannot be tracked
        console.log('A client connected without a userId');
      }
    }
  
    // Cleans up when a client disconnects
    handleDisconnect(client: Socket) {
      // Find the userId associated with this socket
      const userId = [...activeUsers.entries()].find(([_, socket]) => socket.id === client.id)?.[0];
      if (userId) {
        activeUsers.delete(userId); // Remove disconnected user
        console.log(`User disconnected: ${userId}`);
      }
    }
  
    // Handles incoming messages and routes them to the appropriate recipients
    @SubscribeMessage('send_message')
    async handleMessage(
      @MessageBody() data: { sender: string; recipient: string; content: string },
      @ConnectedSocket() client: Socket,
    ) {
      console.log('Message received:', data);
  
      const message = await this.messagesService.createMessage(data); // Persist the message to a database using the service layer
  
      // Emit the message to the sender
      client.emit('receive_message', message);
  
      // Check if the recipient is online
      const recipientSocket = activeUsers.get(data.recipient);
      if (recipientSocket) {
        recipientSocket.emit('receive_message', message); //Send the message to the recipient if they are online
      } else {
        console.log(`Recipient ${data.recipient} is not connected`); // Edge case: If the recipient is not online, log this scenario
      }
    }
  }
  