import { IUser } from 'modules/users/user.model';
import mongoose, { Schema, model, Document } from 'mongoose';
import { IMessage } from 'modules/message/message.model';
export interface IChat extends Document {
  chatName: string;
  isGroupChat: boolean;
  users: IUser[];
  latestMessage: IMessage;
  groupAdmin: IUser;
}
const chatSchema = new Schema<IChat>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const ChatModel = model<IChat>('Chat', chatSchema);
