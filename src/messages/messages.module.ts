import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './socket.gateway';
import { MessageSchema } from './message.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
