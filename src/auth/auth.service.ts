import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
      private readonly userService: UserService,
    private readonly jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<User>,
      ) {}

  async createUser(username: string, password: string) {
    const existingUser = await this.userService.findByUsername(username); // Check if username already exists
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const message = new this.userModel({ username, password: hashedPassword });
    return message.save();
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username); 
    if (!user) return null;
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async login(user: User) {
    const payload = { username: user.username, _id: (user._id).toString() }
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
