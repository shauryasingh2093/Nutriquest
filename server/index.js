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

// ========================================
// Middleware & Routes (registered synchronously so Vercel can see them)
// ========================================

// CORS
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
            secure: process.env.NODE_ENV === 'production',
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

// Connect to MongoDB (lazy — resolves on first request if needed)
let dbReady = connectDB()
    .then(() => {
        app.set('dbStatus', 'ok');
        console.log('✅ Database connected');
    })
    .catch((err) => {
        app.set('dbStatus', 'error');
        console.error('❌ Database connection failed:', err);
    });

// Ensure DB is connected before handling any API request
app.use('/api', async (req, res, next) => {
    try {
        await dbReady;
        next();
    } catch (err) {
        res.status(503).json({ error: 'Database not available', details: err.message });
    }
});
app.use('/auth', async (req, res, next) => {
    try {
        await dbReady;
        next();
    } catch (err) {
        res.status(503).json({ error: 'Database not available', details: err.message });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Fallback for Google OAuth callback without /api prefix
app.use('/api/courses', coursesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lessons', lessonsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: app.get('dbStatus') || 'pending', message: 'NutriQuest API is running' });
});

// Error handling for 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.path });
});

// Only listen if not in Vercel serverless
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

export default app;
