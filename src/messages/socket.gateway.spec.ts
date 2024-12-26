import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './socket.gateway';
import { MessagesService } from './messages.service';
import { Socket } from 'socket.io';
import { MessageStatus} from './message.schema';

// Mock the MessagesService
const mockMessagesService = {
  createMessage: jest.fn(),
  getUndeliveredMessages: jest.fn(),
  storeUndeliveredMessage: jest.fn(),
  updateMessageStatus: jest.fn()
};

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;
  let messagesService: MessagesService;
  let mockSocket: Socket;
  let mockRecipientSocket: Socket;

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
    } as any;

    mockRecipientSocket = {
      emit: jest.fn(),
      handshake: {
        query: {
          userId: 'recipient-user',
        },
      },
      id: 'recipient-socket-id',
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
    gateway['activeUsers'].clear();
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

  it('should handle sending a message when recipient is online', async () => {
    gateway.handleConnection(mockRecipientSocket);

    const messageData = {
      sender: 'test-user',
      recipient: 'recipient-user',
      content: 'Hello!',
    };

    const message = {
      ...messageData,
      _id: '676c4b3b9d2933de45edcd8c',
      timestamp: new Date().toISOString(),
    };

    mockMessagesService.createMessage.mockResolvedValue(message);

    await gateway.handleMessage(messageData, mockSocket);

    // Emitted to sender
    expect(mockSocket.emit).toHaveBeenCalledWith('receive_message', expect.objectContaining({
      sender: 'test-user',
      content: 'Hello!',
    }));

    // Emitted to recipient
    expect(mockRecipientSocket.emit).toHaveBeenCalledWith('receive_message', expect.objectContaining({
      sender: 'test-user',
      content: 'Hello!',
    }));
  });

  it('should handle sending a message when recipient is offline', async () => {
    const messageData = {
      sender: 'test-user',
      recipient: 'offline-user',
      content: 'Hello!',
    };

    const message = {
      ...messageData,
      _id: '676c4b3b9d2933de45edcd8c',
      timestamp: new Date().toISOString(),
    };

    mockMessagesService.createMessage.mockResolvedValue(message);

    await gateway.handleMessage(messageData, mockSocket);

    // Emitted to sender
    expect(mockSocket.emit).toHaveBeenCalledWith('receive_message', expect.objectContaining({
      sender: 'test-user',
      content: 'Hello!',
    }));

    expect(mockMessagesService.storeUndeliveredMessage).toHaveBeenCalledWith(message._id.toString());
  });

  it('should fetch and send undelivered messages', async () => {
    const undeliveredMessages = [
      { _id: '1', sender: 'test-user', recipient : 'recipient-user', content: 'Message 1' },
      { _id: '2', sender: 'test-user', recipient : 'recipient-user',  content: 'Message 2' },
    ];

    mockMessagesService.getUndeliveredMessages.mockResolvedValue(undeliveredMessages);

    await gateway.fetchUndeliveredMessages({ recipient: 'test-user', loggedUserId: 'recipient-user' }, mockRecipientSocket);

    expect(mockMessagesService.getUndeliveredMessages).toHaveBeenCalledWith('test-user', 'recipient-user');
    expect(mockRecipientSocket.emit).toHaveBeenCalledTimes(2);
    expect(mockRecipientSocket.emit).toHaveBeenCalledWith('receive_message', expect.objectContaining({
      _id: '1',
      content: 'Message 1',
    }));
    expect(mockRecipientSocket.emit).toHaveBeenCalledWith('receive_message', expect.objectContaining({
      _id: '2',
      content: 'Message 2',
    }));
  });

  it('should update message status to delivered', async () => {
    const messageId = '676c4b3b9d2933de45edcd8c';
    const userId = 'test-user';

    await gateway.handleDeliveredMessage({ messageId, userId });

    expect(mockMessagesService.updateMessageStatus).toHaveBeenCalledWith(messageId, userId, MessageStatus.DELIVERED);
  });

});
