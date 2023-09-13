import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/User.js";

export const connectPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        // Instead of searching for googleId, you can use the email for linking
        const user = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          // If the user doesn't exist, create a new user
          const newUser = await User.create({
            name: profile.displayName,
            photo: profile.photos[0].value,
            email: profile.emails[0].value, // Use the email for linking
          });

          return done(null, newUser);
        } else {
          // If the user already exists, simply return the user
          return done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
