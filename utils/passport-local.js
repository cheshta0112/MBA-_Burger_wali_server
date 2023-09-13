import passport from "passport";
// import { Strategy } from "passport-local";
import LocalStrategy from "passport-local";
import { User } from "../models/User.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user || user.password != password) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    console.log("deserialize");
    const user = await User.findById(id).exec();
    if (!user) {
      console.log("User not found");
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    console.log("Error in finding user --> Passport");
    return done(err);
  }
});
// module.exports = passport;

export default passport;
