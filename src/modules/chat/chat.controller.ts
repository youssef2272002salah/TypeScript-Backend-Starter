import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import expressAsyncHandler from 'express-async-handler';
import { AuthenticatedRequest } from '../../interfaces/AuthenticatedRequest.interface';
import { AppError } from '../../utils/appError';
import { IChat } from './chat.model';

const chatService = new ChatService();

export class ChatController {
  accessChat = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
      res.status(400);
      throw new AppError('User ID is required', 400);
    }

    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(404);
      throw new AppError('User not found', 404);
    }

    const isChat: IChat[] | [] = await chatService.isChat(user._id, userId);
    const chat = isChat.length > 0 ? isChat[0] : await chatService.createChat(user._id, userId);

    res.json(chat);
  });

  fetchChats = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(404);
      throw new AppError('User not found', 404);
    }
    const chats = await chatService.fetchChats(user._id);
    res.json(chats);
  });

  fetchUsersOfChat = expressAsyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.body;
    if (!chatId) {
      throw new AppError('Chat ID is required', 400);
    }
    const users = await chatService.fetchUsersOfChat(chatId);
    res.json(users);
  });

  createGroupChat = expressAsyncHandler(async (req: Request, res: Response) => {
    let { userIds, chatName } = req.body;
    if (!userIds || !chatName) {
      throw new AppError('User IDs and chat name are required', 400);
    }

    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (typeof userIds === 'string') {
      userIds = JSON.parse(userIds);
    }

    if (userIds.length < 2) {
      throw new AppError('Group chat must have at least 3 members', 400);
    }

    const chat = await chatService.createGroupChat(user._id, userIds, chatName);
    res.json(chat);
  });

  renameGroup = expressAsyncHandler(async (req: Request, res: Response) => {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
      throw new AppError('Chat ID and new chat name are required', 400);
    }

    const updatedChat = await chatService.renameGroup(chatId, chatName);
    if (!updatedChat) {
      throw new AppError('Chat Not Found', 404);
    }

    res.json(updatedChat);
  });

  removeFromGroup = expressAsyncHandler(async (req: Request, res: Response) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      throw new AppError('Chat ID and User ID are required', 400);
    }

    const removedChat = await chatService.removeFromGroup(chatId, userId);
    if (!removedChat) {
      throw new AppError('Chat Not Found', 404);
    }

    res.json(removedChat);
  });

  addToGroup = expressAsyncHandler(async (req: Request, res: Response) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      throw new AppError('Chat ID and User ID are required', 400);
    }

    const addedChat = await chatService.addToGroup(chatId, userId);
    if (!addedChat) {
      throw new AppError('Chat Not Found', 404);
    }

    res.json(addedChat);
  });

  deleteGroup = expressAsyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.body;
    if (!chatId) {
      throw new AppError('Chat ID is required', 400);
    }

    const deletedChat = await chatService.deleteGroup(chatId);
    if (!deletedChat) {
      throw new AppError('Chat Not Found', 404);
    }

    res.json(deletedChat);
  });
}
