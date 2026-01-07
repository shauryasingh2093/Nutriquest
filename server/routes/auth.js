import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readUsers, writeUsers } from '../utils/db.js';

const router = express.Router();
const JWT_SECRET = 'nutriquest-secret-key-change-in-production';

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const users = readUsers();

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email,
            name,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            xp: 0,
            level: 1,
            streak: 0,
            achievements: [],
            completedLessons: [],
        };

        users.push(newUser);
        writeUsers(users);

        // Generate token
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const users = readUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const users = readUsers();
        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
