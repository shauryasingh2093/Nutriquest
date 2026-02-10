import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectDB from './config/database.js';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import aiRoutes from './routes/ai.js';
import progressRoutes from './routes/progress.js';
import lessonsRoutes from './routes/lessons.js';
import webhooksRoutes from './routes/webhooks.js';

const app = express();
const PORT = 3001;

// Connect to MongoDB
connectDB().catch(err => {
    console.error('❌ Failed to connect to MongoDB at startup:', err.message);
});

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Session middleware (required for Passport)
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'fallback-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true in production with HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Webhook route MUST come before express.json() to handle raw body
app.use('/api/webhooks', webhooksRoutes);

// JSON middleware for all other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Fallback for Google OAuth callback without /api prefix
app.use('/api/courses', coursesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lessons', lessonsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'NutriQuest API is running' });
});

// Only listen if not in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

export default app;
