import { MessageModel } from './message.model';
import { ChatModel } from '../chat/chat.model';
import { getCache, setCache, clearCache } from '../../utils/cache';

export class MessageService {
  async getAllMessages(chatId: string) {
    const cacheKey = `messages:${chatId}`;
    const cachedMessages = await getCache(cacheKey);
    if (cachedMessages) return cachedMessages;

    const message = await MessageModel.find({ chat: chatId })
      .populate('sender', 'name email')
      .populate('chat');

    if (message) await setCache(cacheKey, message, 300);
    return message;
  }

  async createMessage(userId: string, content: string, chatId: string) {
    let message = await MessageModel.create({ sender: userId, content, chat: chatId });

    // Populate message details
    message = await message.populate('sender', 'name');
    message = await message.populate('chat');
    message = await MessageModel.populate(message, {
      path: 'chat.users',
      select: 'name email',
    });

    await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });
    // Clear cache
    const chat = await ChatModel.findById(chatId);
    if (chat) {
      for (const user of chat.users) {
        await clearCache(`chat:${user._id}`);
      }
    }
    await clearCache(`messages:${chatId}`);
    return message;
  }
}
