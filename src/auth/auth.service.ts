import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async createUser(username: string, password: string) {
    const existingUser = await this.userService.findByUsername(username); // Check if username already exists
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const message = new this.userModel({ username, password: hashedPassword });
    return message.save();
  }

  async validateUser(username: string, password: string, deviceId: string, deviceType: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    // Handle device management (store or update device)
    const registeredDeviceId = await this.handleDeviceRegistration(user, deviceId, deviceType);

    return { user, registeredDeviceId };
  }

  async handleDeviceRegistration(user: User, deviceId: string, deviceType: string) {
    if (!deviceId || deviceId === '') {
      deviceId = uuidv4();
    }
    // Check if the device already exists
    const existingDevice = user.devices.find(device => device.deviceId === deviceId);

    if (!existingDevice) {
      // If device doesn't exist, add new device
      user.devices.push({
        deviceId,
        deviceType,
        lastActive: new Date(),
      });
    } else {
      existingDevice.lastActive = new Date();
    }

    await user.save();
    return deviceId;
  }

  async login(user: User) {
    const payload = { username: user.username, _id: (user._id).toString() }
    return {
      access_token: await this.jwtService.sign(payload)
    };
  }
}
