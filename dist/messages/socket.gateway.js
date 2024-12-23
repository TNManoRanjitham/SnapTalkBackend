"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messages_service_1 = require("./messages.service");
const activeUsers = new Map();
let MessagesGateway = class MessagesGateway {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            activeUsers.set(userId, client);
            console.log(`User connected: ${userId}`);
        }
        else {
            console.log('A client connected without a userId');
        }
    }
    handleDisconnect(client) {
        const userId = [...activeUsers.entries()].find(([_, socket]) => socket.id === client.id)?.[0];
        if (userId) {
            activeUsers.delete(userId);
            console.log(`User disconnected: ${userId}`);
        }
    }
    async handleMessage(data, client) {
        console.log('Message received:', data);
        const message = await this.messagesService.createMessage(data);
        client.emit('receive_message', message);
        const recipientSocket = activeUsers.get(data.recipient);
        if (recipientSocket) {
            recipientSocket.emit('receive_message', message);
        }
        else {
            console.log(`Recipient ${data.recipient} is not connected`);
        }
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMessage", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: (origin, callback) => {
                const frontendUrl = process.env.FRONTEND_URL;
                if (origin === frontendUrl || !origin) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST'],
        },
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesGateway);
//# sourceMappingURL=socket.gateway.js.map