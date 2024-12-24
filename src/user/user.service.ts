import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
      ) {}

  async createUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const message = new this.userModel({ username, password: hashedPassword });
    return message.save();
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }
}
