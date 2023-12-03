// PassportConfig.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export class PassportConfig {
  constructor() {
    this.configureGoogleStrategy();
  }

  private configureGoogleStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: '266369111079-mmqo7iqufaqh3k67m50bhocc6guinp04.apps.googleusercontent.com',
          clientSecret: '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',
          callbackURL: 'http://localhost:5005/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
          // Use profile information to create or update a user
          return done(null, profile);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });
  }
}
