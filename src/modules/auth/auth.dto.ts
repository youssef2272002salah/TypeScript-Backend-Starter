import { IsEmail, IsNotEmpty, MinLength, Matches, ValidateIf, IsOptional } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'Full name is required' })
  fullname!: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsNotEmpty({ message: 'Password confirmation is required' })
  @ValidateIf((o) => o.password === o.passwordConfirm, { message: 'Passwords do not match' })
  passwordConfirm!: string;

  @IsOptional()
  country?: string;

  @Matches(/^[0-9]+$/, { message: 'Phone number must be numeric' })
  @IsOptional()
  phone?: string;

  @Matches(/^\+\d{1,4}$/, { message: 'Invalid phone code format (e.g., +1, +44)' })
  @IsOptional()
  phoneCode?: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsNotEmpty({ message: 'Password confirmation is required' })
  @ValidateIf((o) => o.password === o.passwordConfirm, { message: 'Passwords do not match' })
  passwordConfirm!: string;

  @IsNotEmpty({ message: 'Reset token is required' })
  resetToken!: string;
}
