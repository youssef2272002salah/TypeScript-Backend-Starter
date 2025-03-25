import { RequestHandler, Router } from 'express';

import { UserController } from './user.controller';
import { protect, restrictTo } from '../auth/auth.middleware';
import { validateDto } from '../../utils/validateDto';
import { UpdateUserDto } from './users.dto';
const userController = new UserController();
const userRouter = Router();

// User Profile
userRouter.get('/me', protect, userController.getMe);
userRouter.patch('/me', protect, validateDto(UpdateUserDto), userController.updateMe);
userRouter.delete('/me', protect, userController.deleteMe);

// it is allowed for all users for message you can update it to be allowed for admin only
userRouter.get('/', protect, userController.getAllUsers);

// Admin Routes
userRouter.get('/:id', protect, restrictTo('admin') as RequestHandler, userController.getUserById);
userRouter.delete(
  '/:id',
  protect,
  restrictTo('admin') as RequestHandler,
  userController.deleteUserById,
);
userRouter.patch(
  '/:id',
  protect,
  restrictTo('admin') as RequestHandler,
  validateDto(UpdateUserDto),
  userController.updateUserById,
);

export { userRouter };
