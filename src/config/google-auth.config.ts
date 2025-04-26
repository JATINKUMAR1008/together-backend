import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './app.config';
import { loginOrCreateAccountService } from '../services/auth.service';
import { ProviderEnum } from '../enums/account.providers.enum';

// Ensure Strategy is properly initialized

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get profile information
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : undefined;
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;
        
        if (!email) {
          return done(new Error('Email not found from Google profile'), false);
        }
        
        // Login or create a new account using the Google credentials
        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          providerId: profile.id,
          displayName: profile.displayName || email.split('@')[0],
          email,
          picture,
        });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// We're using a custom type for our user to avoid TypeScript errors
type UserType = any;

// Serialize user to the session (only used for Google auth flow)
passport.serializeUser((user: UserType, done) => {
  done(null, user);
});

// Deserialize user from the session (only used for Google auth flow)
passport.deserializeUser((user: UserType, done) => {
  done(null, user);
});

// The strategy is now registered with Passport
// No need to export anything as we're importing this file for its side effects
