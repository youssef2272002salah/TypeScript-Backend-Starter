import { Request } from 'express';
import { IUser } from '../modules/users/user.model';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}
