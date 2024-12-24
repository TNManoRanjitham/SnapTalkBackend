import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module'; './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures .env variables are accessible throughout the application
    }),
    // Use .env for MongoDB URI
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/snap_talk'), 
    MessagesModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
