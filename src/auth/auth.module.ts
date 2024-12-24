import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserSchema } from '../user/user.schema';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';

@Module({
  imports: [PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',  // Store this in env variables
      signOptions: { expiresIn: '1h' },
    }),MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AuthController],
  providers: [ AuthService, JwtStrategy, UserService],
})
export class AuthModule {}
