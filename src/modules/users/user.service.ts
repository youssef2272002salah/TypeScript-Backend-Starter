import { AppError } from '../../utils/appError';
import { UserModel } from './user.model';
import { log } from '../../utils/logging';
import { APIFeatures } from '../../utils/apiFeatures';
import { getCache, setCache, clearCache } from '../../utils/cache';
import { UpdateUserDto } from './users.dto';

export class UserService {
  async getUserById(id: string) {
    const cachedUser = await getCache(`user:${id}`);
    if (cachedUser) {
      log('info', 'User retrieved from cache', { userId: id });
      return cachedUser;
    }

    const user = await UserModel.findById(id);
    if (!user) {
      log('warn', 'User not found in DB', { userId: id });
      throw new AppError('User not found', 404);
    }

    log('info', 'User retrieved from DB', { userId: id });

    await setCache(`user:${id}`, user, 600);

    return user;
  }

  async updateUser(id: string, update: UpdateUserDto) {
    const user = await UserModel.findByIdAndUpdate(id, update, { new: true });
    if (!user) {
      log('warn', 'User not found for update', { userId: id });
      throw new AppError('User not found', 404);
    }

    log('info', 'User updated in DB', { userId: id, update });

    // Update cache with new data
    await setCache(`user:${id}`, user, 600);

    return user;
  }

  async deleteUser(id: string) {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      log('warn', 'User not found for deletion', { userId: id });
      throw new AppError('User not found', 404);
    }

    log('info', 'User deleted from DB', { userId: id });

    await clearCache(`user:${id}`);

    return user;
  }

  async getAllUsers(req: any) {
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const cacheKey = `users:all:page=${page}:limit=${limit}`;

    const cachedUsers = await getCache(cacheKey);
    if (cachedUsers) {
      log('info', `All users retrieved from cache (Page: ${page}, Limit: ${limit})`);
      return cachedUsers;
    }

    let query = UserModel.find();
    const apiFeatures = new APIFeatures(query, req.query).filter().sort().limitFields().paginate();
    const users = await apiFeatures.getQuery();

    log('info', `All users retrieved from DB (Page: ${page}, Limit: ${limit})`);

    await setCache(cacheKey, users, 300);

    return users;
  }
}
