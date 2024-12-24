import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

   // Function to find a user by username
   async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async getUser() {
    const users = await this.userModel.find().select('username');
    return users;
  }

   async createUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const message = new this.userModel({ username, password: hashedPassword });
    return message.save();
  }

}
