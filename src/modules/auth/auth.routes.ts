import { Router } from 'express';
import { AuthController } from './auth.controller';
import { protect } from './auth.middleware';
import { validateDto } from '../../utils/validateDto';
import { LoginDto, ResetPasswordDto, SignupDto } from './auth.dto';
import passport from 'passport';
import { AuthService } from './auth.service';

const authRouter = Router();
const authController = new AuthController();
// Authentication
authRouter.post('/signup', validateDto(SignupDto), authController.signup);
authRouter.post('/login', validateDto(LoginDto), authController.login);
authRouter.get('/logout', protect, authController.logout);
authRouter.post('/refresh', authController.refreshToken);

authRouter.post('/resend-verification-email', authController.resendVerificationEmail);
authRouter.get('/verify-email', authController.verifyEmail);

// Password Management
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.patch('/reset-password', validateDto(ResetPasswordDto), authController.resetPassword);
authRouter.patch('/update-password', protect, authController.updatePassword);

// passport routes
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] }),
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  authController.googleAuthCallback,
);

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  authController.facebookAuthCallback,
);

export { authRouter };
