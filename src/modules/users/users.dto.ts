import { IUser } from '../users/user.model';

export class UpdateUserDto implements Partial<IUser> {
  fullname!: string;
  email!: string;
  country!: string;
  phone!: string;
  phoneCode!: string;
  pic!: string;
}
