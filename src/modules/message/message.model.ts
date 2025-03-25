import { IChat } from 'modules/chat/chat.model';
import { IUser } from 'modules/users/user.model';
import mongoose, { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: IUser;
  content: string;
  chat: IChat;
  readBy: IUser[];
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const MessageModel = model<IMessage>('Message', messageSchema);
