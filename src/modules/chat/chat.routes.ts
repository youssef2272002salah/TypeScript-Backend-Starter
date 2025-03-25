import { Router } from 'express';
import { ChatController } from './chat.controller';
import { protect } from '../auth/auth.middleware';
const chatRouter = Router();
const chatController = new ChatController();

chatRouter.post('/', protect, chatController.accessChat);
chatRouter.get('/', protect, chatController.fetchChats);
chatRouter.post('/group', protect, chatController.createGroupChat);
chatRouter.get('/users', protect, chatController.fetchUsersOfChat);
chatRouter.put('/rename', protect, chatController.renameGroup);
chatRouter.put('/groupremove', protect, chatController.removeFromGroup);
chatRouter.put('/groupadd', protect, chatController.addToGroup);
chatRouter.delete('/group', protect, chatController.deleteGroup);

export { chatRouter };
