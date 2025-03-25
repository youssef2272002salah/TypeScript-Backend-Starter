import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { MessageService } from './message.service';
import { AuthenticatedRequest } from '../../interfaces/AuthenticatedRequest.interface';
import { AppError } from '../../utils/appError';

const messageService = new MessageService();

export class MessageController {
  allMessages = expressAsyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.params;
    if (!chatId) {
      throw new AppError('Chat ID is required', 400);
    }

    const messages = await messageService.getAllMessages(chatId);
    res.json(messages);
  });

  sendMessage = expressAsyncHandler(async (req: Request, res: Response) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      throw new AppError('Message content and chat ID are required', 400);
    }

    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const message = await messageService.createMessage(user._id, content, chatId);
    res.json(message);
  });
}
