import { Router } from 'express';
import { MessageController } from './message.controller';
import { protect } from '../auth/auth.middleware';

const messageRouter = Router();
const messageController = new MessageController();

messageRouter.get('/:chatId', protect, messageController.allMessages);
messageRouter.post('/', protect, messageController.sendMessage);

export { messageRouter };
