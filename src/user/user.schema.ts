import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Device {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  deviceType: string;

  @Prop({ default: Date.now })
  lastActive: Date;
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true }) 
  password: string;

  @Prop({ type: [Device], default: [] })
  devices: Device[];
}

export const UserSchema = SchemaFactory.createForClass(User);
