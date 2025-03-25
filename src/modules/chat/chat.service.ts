import { getCache, setCache, clearCache } from '../../utils/cache';
import { UserModel } from '../users/user.model';
import { ChatModel, IChat } from './chat.model';

export class ChatService {
  async isChat(userId: string, friendId: string): Promise<IChat[]> {
    const cachekey = `chat:${userId}:${friendId}`;
    const cachedChat = await getCache<IChat[]>(cachekey);

    if (cachedChat && Array.isArray(cachedChat) && cachedChat.length > 0) {
      return cachedChat;
    }

    if (cachedChat && typeof cachedChat === 'object') {
      return [cachedChat as unknown as IChat];
    }

    const chat = await ChatModel.findOne({
      isGroupChat: false,
      users: { $all: [userId, friendId] },
    })
      .populate({ path: 'users', select: '-password' })
      .populate({ path: 'latestMessage' })
      .lean();

    if (!chat) return [];

    await setCache(cachekey, chat, 300);
    return [chat];
  }

  async createChat(userId: string, friendId: string) {
    const createdChat = await ChatModel.create({
      chatName: 'sender',
      isGroupChat: false,
      users: [userId, friendId],
    });

    // Clear cache
    await clearCache(`chat:${userId}`);
    await clearCache(`chat:${friendId}`);
    await clearCache(`chat:${userId}:${friendId}`);

    return ChatModel.findOne({ _id: createdChat._id }).populate('users', '-password');
  }

  async fetchChats(userId: string) {
    const cacheKey = `chat:${userId}`;

    const cachedChats = await getCache(cacheKey);
    if (cachedChats) return cachedChats;

    const chats = await ChatModel.find({ users: { $elemMatch: { $eq: userId } } })
      .populate({ path: 'users', select: '-password' })
      .populate({ path: 'groupAdmin', select: '-password' })
      .populate({ path: 'latestMessage' })
      .sort({ updatedAt: -1 });

    // Populate latestMessage.sender
    await UserModel.populate(chats, {
      path: 'latestMessage.sender',
      select: '-password',
    });

    await setCache(cacheKey, chats, 300);

    return chats;
  }

  async fetchUsersOfChat(chatId: string) {
    const chat = await ChatModel.findById(chatId).populate('users', '-password');
    return chat?.users;
  }
  async createGroupChat(userId: string, userIds: string[], chatName: string) {
    const users = [...userIds, userId];
    const createdChat = await ChatModel.create({
      chatName,
      isGroupChat: true,
      users,
      groupAdmin: userId,
    });

    return ChatModel.findOne({ _id: createdChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
  }

  async renameGroup(chatId: string, chatName: string) {
    return ChatModel.findByIdAndUpdate(chatId, { chatName }, { new: true })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
  }

  async removeFromGroup(chatId: string, userId: string) {
    return ChatModel.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
  }

  async addToGroup(chatId: string, userId: string) {
    return ChatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
  }

  async deleteGroup(chatId: string) {
    return ChatModel.findByIdAndDelete(chatId);
  }
}
