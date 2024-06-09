import passportOauth from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
const GoogleStrategy = passportOauth.Strategy;
dotenv.config();

const passportMiddleware = {
  GoogleAuth: new GoogleStrategy(
    {
      clientID: process.env.GOOGLEID,
      clientSecret: process.env.SECRETGOOGLEID,
      callbackURL: process.env.CALLBACKURLGOOGLE,
    },
    function (accessToken, refreshToken, profile, cb) {
      (async () => {
        try {
          const user = await User.findOne({ googleId: profile.id });

          if (!user) {
            const newUser = await User.create({
              googleId: profile.id,
              username: profile.name.givenName,
              avatar: profile.photos[0].value,
              account: profile.emails[0].value,
              role: 'customer',
              gender: 'male',
            });
            return cb(null, newUser);
          }
          return cb(null, user);
        } catch (error) {
          return cb(error, null);
        }
      })();
    }
  ),
};

export default passportMiddleware;
