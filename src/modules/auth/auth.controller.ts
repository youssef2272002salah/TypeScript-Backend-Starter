import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { AuthService } from './auth.service';
import { LoginDto, ResetPasswordDto, SignupDto } from './auth.dto';
import { AuthenticatedRequest } from '../../interfaces/AuthenticatedRequest.interface';
import { log } from '../../utils/logging';

const authService = new AuthService();

export class AuthController {
  googleAuthCallback = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Google authentication callback received');
    const user = req.user as any;
    res.status(200).json({ status: 'success', data: user });
  });

  facebookAuthCallback = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Facebook authentication callback received');
    const user = req.user as any;
    res.status(200).json({ status: 'success', data: user });
  });

  signup = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Signup request received', { email: req.body.email });
    const user = await authService.signup(req.body as SignupDto, res);
    log('info', 'Signup successful');
    res.status(201).json({
      status: 'success',
      message: 'Signup successful! Please verify your email.',
      user,
    });
  });

  login = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Login request received', { email: req.body.email });
    const user = await authService.login(req.body as LoginDto, res);
    log('info', 'Login successful');
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: user,
    });
  });

  logout = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Logout request received');

    await authService.logout(res);

    log('info', 'Logout successful');
    res.status(200).json({ message: 'Logout successful' });
  });

  refreshToken = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Refresh token request received');
    const newAccessToken = await authService.refreshToken(req, res);
    log('info', 'Refresh token successful');
    res.status(200).json({ accessToken: newAccessToken });
  });

  verifyEmail = expressAsyncHandler(async (req: Request, res: Response) => {
    const token = req.query.token as string;
    log('info', 'Email verification requested', { token });
    await authService.verifyEmail(token);
    log('info', 'Email verified successfully');
    res.status(200).json({ message: 'Email verified successfully' });
  });

  resendVerificationEmail = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Resend verification email request received', { email: req.body.email });
    await authService.resendVerificationEmail(req.body.email as LoginDto['email']);
    log('info', 'Verification email resent successfully', { email: req.body.email });
    res.status(200).json({ message: 'Verification email sent successfully' });
  });

  forgotPassword = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Forgot password request received', { email: req.body.email });
    const result = await authService.forgotPassword(req.body.email);
    log('info', 'Forgot password process completed', { email: req.body.email });
    res.status(200).json({ status: 'success', data: result });
  });

  resetPassword = expressAsyncHandler(async (req: Request, res: Response) => {
    log('info', 'Reset password request received', { email: req.body.email });
    const result = await authService.resetPassword(req.body as ResetPasswordDto, res);
    log('info', 'Password reset successful', { email: req.body.email });
    res.status(200).json({ status: 'success', data: result });
  });

  // todo: type any
  updatePassword = expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      log('warn', 'Update password attempt without authentication');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    log('info', 'Update password request received', { userId: user.id });
    const result = await authService.updatePassword(user.id, req.body, res);
    log('info', 'Password update successful', { userId: user.id });
    res.status(200).json({ status: 'success', data: result });
  });
}
