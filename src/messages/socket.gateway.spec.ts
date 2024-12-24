import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './socket.gateway';
import { MessagesService } from './messages.service';
import { Socket } from 'socket.io';

// Mock the MessagesService
const mockMessagesService = {
  createMessage: jest.fn(),
};

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;
  let messagesService: MessagesService;
  let mockSocket: Socket;

  beforeEach(async () => {
    // Create a testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesGateway,
        { provide: MessagesService, useValue: mockMessagesService }, // Mocking MessagesService
      ],
    }).compile();

    gateway = module.get<MessagesGateway>(MessagesGateway);
    messagesService = module.get<MessagesService>(MessagesService);
    mockSocket = {
      emit: jest.fn(),
      handshake: {
        query: {
          userId: 'test-user',
        },
      },
      id: 'socket-id',
    } as any; // Mock the socket object
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle user connection', () => {
    // Simulating a new connection
    gateway.handleConnection(mockSocket);
    expect(gateway['activeUsers'].size).toBe(1);
    expect(gateway['activeUsers'].has('test-user')).toBe(true);
  });

  it('should handle user disconnection', () => {
    // Simulating a new connection first
    gateway.handleConnection(mockSocket);
    expect(gateway['activeUsers'].size).toBe(1);

    // Simulating disconnection
    gateway.handleDisconnect(mockSocket);
    expect(gateway['activeUsers'].size).toBe(0);
  });

  it('should handle sending a message', async () => {
    const messageData = {
      sender: 'test-user',
      recipient: 'recipient-user',
      content: 'Hello!',
    };
    const message = { ...messageData, timestamp: new Date() };

    // Mock the createMessage method to return a message
    mockMessagesService.createMessage.mockResolvedValue(message);

    // Simulating a message send
    await gateway.handleMessage(messageData, mockSocket);

    // Check if message was emitted to the sender
    expect(mockSocket.emit).toHaveBeenCalledWith('receive_message', message);

    // If the recipient is connected, emit to them as well
    expect(gateway['activeUsers'].size).toBe(0); // No recipient is connected, so size should be 0
  });
});
