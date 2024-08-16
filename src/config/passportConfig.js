import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js'; // Adjust the import based on your model's name and path

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        fullName: profile.displayName,
        email: profile.emails?.[0]?.value, // Optional chaining to safely access email
        googleId: profile.id,
        isVerified: true,
      });
      await user.save();
    }

    done(null, user);
  } catch (error) {
    console.error('Error during Google authentication:', error);
    done(error, false); // Use false to indicate failure
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize using user.id
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});

export default passport;
