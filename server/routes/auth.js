import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { checkStreakStatus } from '../utils/streakHelper.js';
import { authenticate } from '../middleware/auth.js';

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

export default router;
