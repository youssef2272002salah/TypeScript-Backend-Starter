import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../users/user.model';
import { IUser } from '../users/user.model';
import { AppError } from '../../utils/appError';
import expressAsyncHandler from 'express-async-handler';
import { log } from '../../utils/logging';

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    let token;
    if (authReq.headers.authorization?.startsWith('Bearer')) {
      token = authReq.headers.authorization.split(' ')[1];
    } else if (authReq.cookies?.jwt) {
      token = authReq.cookies.jwt;
    }

    if (!token) {
      throw new AppError('You are not logged in. Please log in to access this resource.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      iat: number;
    };
    if (!decoded) {
      throw new AppError('Invalid token. Please log in again.', 401);
    }

    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    if (currentUser.passwordChangedAt) {
      const passwordChangedTimestamp = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < passwordChangedTimestamp) {
        throw new AppError('User recently changed password. Please log in again.', 401);
      }
    }

    authReq.user = currentUser;
    res.locals.user = currentUser;
    next();
  },
);

export const restrictTo =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      log('warn', '[AuthService] User does not have permission to perform this action', {
        userId: req.user?._id,
      });
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
