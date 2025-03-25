import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { UserModel } from '../modules/users/user.model';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { log } from 'console';

dotenv.config();

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10000) || '7d',
  });
};

const authCallback = async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth environment variables are missing.');
    }

    const email = profile.emails?.[0]?.value;
    const fullname =
      profile.displayName ||
      `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() ||
      'Anonymous User';

    if (!fullname.trim()) {
      return done(null, false, { message: 'Please add a name' });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        fullname,
        email,
        providerId: profile.id,
        provider: profile.provider,
        role: 'user',
        isVerified: true,
      });
    }

    const token = signToken(user._id.toString());
    return done(null, { user, token });
  } catch (error) {
    log('error', (error as Error).message);
    return done(error, null);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    authCallback,
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      profileFields: ['id', 'displayName', 'name', 'emails'],
    },
    authCallback,
  ),
);
