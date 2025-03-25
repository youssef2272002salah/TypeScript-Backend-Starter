import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { UserService } from './user.service';
import { AuthenticatedRequest } from 'interfaces/AuthenticatedRequest.interface';
import { AppError } from '../../utils/appError';
import { log } from '../../utils/logging';
import { UpdateUserDto } from './users.dto';

const userService = new UserService();

export class UserController {
  private checkUser = (req: Request) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      log('warn', 'Attempt to access profile failed: User not found');
      throw new AppError('User not found', 404);
    }
    return user;
  };

  getMe = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = this.checkUser(req);

    const me = await userService.getUserById(user._id);
    log('info', `User profile retrieved for userId: ${user._id}`);

    res.status(200).json({
      status: 'success',
      data: me,
    });
  });

  updateMe = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = this.checkUser(req);

    const updatedUser = await userService.updateUser(user._id, req.body);
    log('info', `User profile updated for userId: ${user._id}`);

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  });

  deleteMe = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = this.checkUser(req);

    await userService.deleteUser(user._id);
    log('info', `User account deleted for userId: ${user._id}`);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  getAllUsers = expressAsyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers(req);
    log('info', 'All users retrieved successfully');
    res.status(200).json(users);
  });

  getUserById = expressAsyncHandler(async (req: Request, res: Response) => {
    if (!req.params.id) {
      throw new AppError('User ID is required', 400);
    }
    const user = await userService.getUserById(req.params.id as string);
    log('info', `User profile retrieved for userId: ${req.params.id}`);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  });

  updateUserById = expressAsyncHandler(async (req: Request, res: Response) => {
    if (!req.params.id) {
      throw new AppError('User ID is required', 400);
    }
    const updatedUser = await userService.updateUser(req.params.id, req.body as UpdateUserDto);
    log('info', `User profile updated for userId: ${req.params.id}`);
    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  });

  deleteUserById = expressAsyncHandler(async (req: Request, res: Response) => {
    if (!req.params.id) {
      throw new AppError('User ID is required', 400);
    }
    await userService.deleteUser(req.params.id as string);
    log('info', `User account deleted for userId: ${req.params.id}`);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}
