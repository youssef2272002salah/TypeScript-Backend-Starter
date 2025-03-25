import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel, IUser } from '../users/user.model';
import MailService from '../../utils/mailer';
import { LoginDto, SignupDto, ResetPasswordDto } from '../auth/auth.dto';
import { AppError } from '../../utils/appError';
import { Response, Request } from 'express';
import { log } from '../../utils/logging';

export class AuthService {
  private signAccessToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '15m',
    });
  }

  private signRefreshToken(id: string): string {
    return jwt.sign({ id }, process.env.REFRESH_SECRET || 'refresh_secret', {
      expiresIn: '7d',
    });
  }

  createSendToken(user: IUser, res: Response) {
    const userId = user?._id?.toString() || user?.id?.toString();
    console.log(userId);
    const accessToken = this.signAccessToken(userId);
    const refreshToken = this.signRefreshToken(userId);

    log('info', '[AuthService] Tokens created', { userId: user._id });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      _id: user._id || user.id,
      fullname: user.fullname,
      email: user.email,
      pic: user.pic,
      role: user.role,
      accessToken,
    };
  }

  async signup(userDto: SignupDto, res: Response) {
    log('info', '[AuthService] Signup attempt', { email: userDto.email });
    const newUser = await UserModel.create({ ...userDto });
    log('info', '[AuthService] User created', { userId: newUser._id });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.verificationToken = verificationToken;
    await newUser.save({ validateBeforeSave: false });

    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
    const emailData = MailService.generateVerificationEmail(newUser.email, verificationLink);
    await MailService.sendEmail(emailData);
    log('info', '[AuthService] Verification email sent', { email: newUser.email });

    return this.createSendToken(newUser, res);
  }

  async login({ email, password }: LoginDto, res: Response) {
    log('info', '[AuthService] Login attempt', { email });
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      log('warn', '[AuthService] Invalid login attempt', { email });
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isVerified) {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      await user.save({ validateBeforeSave: false });

      const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
      const emailData = MailService.generateVerificationEmail(user.email, verificationLink);
      await MailService.sendEmail(emailData);
      log('warn', '[AuthService] Email not verified, verification email sent', { email });
      throw new AppError('Email not verified. Verification email sent', 401);
    }

    log('info', '[AuthService] Login successful', { userId: user._id });
    return this.createSendToken(user, res);
  }

  async logout(res: Response): Promise<void> {
    log('info', '[AuthService] Logout');
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'strict',
      path: '/',
    });
    return;
  }

  async refreshToken(req: Request, res: Response) {
    const token = (req as Request & { cookies: { refreshToken: string } }).cookies.refreshToken;

    if (!token) {
      log('warn', '[AuthService] No refresh token provided');
      throw new AppError('No refresh token provided', 403);
    }
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET || 'refresh_secret') as {
      id: string;
    };
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      log('warn', '[AuthService] Invalid refresh token');
      throw new AppError('Invalid refresh token', 403);
    }

    log('info', '[AuthService] Refresh token validated', { userId: user._id });

    const newAccessToken = this.signAccessToken(user._id.toString());
    return newAccessToken;
  }

  async verifyEmail(token: string) {
    log('info', '[AuthService] Email verification attempt', { token });
    const user = await UserModel.findOne({ verificationToken: token });
    if (!user) {
      log('warn', '[AuthService] Invalid verification token', { token });
      throw new AppError('Invalid verification token', 400);
    }

    user.verificationToken = undefined;
    user.isVerified = true;
    await user.save();
    log('info', '[AuthService] Email verified successfully', { userId: user._id });
    return { message: 'Email successfully verified' };
  }

  async resendVerificationEmail(email: string) {
    const user = await UserModel.findOne({
      email,
      isVerified: false,
    });

    if (!user) {
      throw new AppError('User not found or already verified', 404);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save({ validateBeforeSave: false });

    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
    const emailData = MailService.generateVerificationEmail(user.email, verificationLink);
    await MailService.sendEmail(emailData);
  }

  async forgotPassword(email: string) {
    log('info', '[AuthService] Forgot password request', { email });
    const user = await UserModel.findOne({ email });
    if (!user) {
      log('warn', '[AuthService] User not found for forgot password', { email });
      throw new AppError('User not found', 404);
    }

    const resetToken = crypto.randomBytes(8).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const emailData = MailService.generateResetPasswordEmail(user.email, resetToken);
    await MailService.sendEmail(emailData);
    log('info', '[AuthService] Password reset email sent', { email });
    return { message: 'Password reset token sent' };
  }

  async resetPassword(dto: ResetPasswordDto, res: Response) {
    const hashedToken = crypto.createHash('sha256').update(dto.resetToken).digest('hex');
    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      log('warn', '[AuthService] Invalid reset token');
      throw new AppError('Token is invalid or expired', 400);
    }

    user.password = dto.password;
    user.passwordConfirm = dto.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return this.createSendToken(user, res);
  }

  async updatePassword(userId: string, dto: ResetPasswordDto, res: Response) {
    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      log('warn', '[AuthService] Update password attempt without authentication');
      throw new AppError('User not authenticated', 401);
    }

    if (!user.password || !(await bcrypt.compare(dto.password, user.password))) {
      log('warn', '[AuthService] Invalid password update attempt', { userId });
      throw new AppError('Invalid password', 401);
    }
    user.password = dto.password;
    user.passwordConfirm = dto.passwordConfirm;
    await user.save();

    return this.createSendToken(user, res);
  }
}
