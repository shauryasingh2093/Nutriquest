import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        req.userId = user._id;
        next();

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid authentication token' });
    }
};
