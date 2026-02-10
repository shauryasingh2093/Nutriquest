import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Configure Google OAuth Strategy
console.log('🔍 Checking Environment Variables:');
console.log('- GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Present' : '❌ MISSING');
console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Present' : '❌ MISSING');
console.log('- GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || 'Using default localhost');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('🔐 Google OAuth callback received for:', profile.emails[0].value);

                // Extract user info from Google profile
                const email = profile.emails[0].value;
                const googleId = profile.id;
                const name = profile.displayName;
                const avatar = profile.photos[0]?.value;

                // Check if user already exists by googleId or email
                let user = await User.findOne({
                    $or: [{ googleId }, { email }]
                });

                if (user) {
                    let updated = false;
                    // User exists - update googleId if not set
                    if (!user.googleId) {
                        user.googleId = googleId;
                        updated = true;
                    }
                    // Update avatar if not already set
                    if (!user.avatar && avatar) {
                        user.avatar = avatar;
                        updated = true;
                    }

                    if (updated) {
                        await user.save();
                        console.log('✅ Updated existing user with Google info:', email);
                    } else {
                        console.log('✅ Existing Google user logged in:', email);
                    }
                } else {
                    // Create new user
                    user = await User.create({
                        name,
                        email,
                        googleId,
                        avatar,
                    });
                    console.log('✅ New Google user created:', email);
                }

                return done(null, user);
            } catch (error) {
                console.error('❌ Google OAuth error:', error);
                return done(error, null);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
