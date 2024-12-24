import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
}

export const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = model<User>('User', UserSchema);