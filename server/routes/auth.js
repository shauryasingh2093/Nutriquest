import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { checkStreakStatus } from '../utils/streakHelper.js';
import { authenticate } from '../middleware/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user (password will be hashed automatically by the model)
        const newUser = new User({
            email,
            name,
            password,
            xp: 0,
            level: 1,
            streak: 0,
            longestStreak: 0,
            achievements: [],
            completedLessons: [],
            stageProgress: {}
        });

        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user (password is automatically excluded by the model's toJSON method)
        res.json({ user: newUser, token });
    } catch (error) {
        console.error('Signup error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password using the model's comparePassword method
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user (password is automatically excluded)
        res.json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
    try {
        // User is already attached to req by the authenticate middleware
        let user = req.user;

        // Check if streak should be broken due to inactivity
        const { streakBroken, user: updatedUserData } = checkStreakStatus(user.toObject());

        if (streakBroken) {
            // Update the user in the database
            user.streak = updatedUserData.streak;
            user.lastActivityDate = updatedUserData.lastActivityDate;
            await user.save();
        }

        res.json({ user });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update profile
router.patch('/profile', authenticate, async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = req.user;

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;

        await user.save();
        res.json({ user });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ========================================
// Google OAuth Routes (Passport.js)
// ========================================

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
    console.log('🔐 Initiating Google OAuth...');
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    passport.authenticate('google', { session: false }, async (err, user, info) => {
        try {
            if (err || !user) {
                console.error('❌ Passport auth failed:', err || 'No user found', info);
                return res.redirect(`${frontendUrl}/login?error=oauth_failed&reason=${encodeURIComponent(err?.message || 'auth_failed')}`);
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET || 'fallback-secret',
                { expiresIn: '7d' }
            );

            console.log('✅ Google OAuth successful, redirecting to frontend');
            // Redirect to our new frontend callback route
            res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
        } catch (error) {
            console.error('❌ Detailed Google OAuth callback error:', error);
            res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }
    })(req, res, next);
});

export default router;
