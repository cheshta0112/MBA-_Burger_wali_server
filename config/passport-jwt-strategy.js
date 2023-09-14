import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/User.js";

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "mbaburgerwali";

passport.use(
  new Strategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

// module.exports = passport;
