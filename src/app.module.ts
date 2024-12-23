import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/snap_talk'), // MongoDB URI
    MessagesModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
