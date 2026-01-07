import express from 'express';
import jwt from 'jsonwebtoken';
import { readUsers, writeUsers } from '../utils/db.js';

const router = express.Router();
const JWT_SECRET = 'nutriquest-secret-key-change-in-production';

// Middleware to verify token
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Complete a stage
router.post('/complete-stage', authMiddleware, (req, res) => {
    try {
        const { courseId, lessonId, stage, xp } = req.body;
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === req.userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[userIndex];
        const stageKey = `${courseId}-${lessonId}`;

        // Initialize stage progress if not exists
        if (!user.stageProgress) user.stageProgress = {};
        if (!user.stageProgress[stageKey]) {
            user.stageProgress[stageKey] = {
                read: false,
                practice: false,
                notes: false
            };
        }

        // Mark stage as complete
        if (!user.stageProgress[stageKey][stage]) {
            user.stageProgress[stageKey][stage] = true;

            // Award XP for stage completion
            user.xp += xp;
            const previousLevel = user.level;
            user.level = Math.floor(user.xp / 1000) + 1;
            const leveledUp = user.level > previousLevel;

            // Update streak and activity date
            const today = new Date().toDateString();
            const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate).toDateString() : null;

            if (lastActivity !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toDateString();

                if (lastActivity === yesterdayStr) {
                    user.streak += 1;
                } else if (lastActivity !== today) {
                    user.streak = 1;
                }

                user.lastActivityDate = new Date().toISOString();

                if (user.streak > user.longestStreak) {
                    user.longestStreak = user.streak;
                }
            }

            // Check if all stages complete
            const allStagesComplete = user.stageProgress[stageKey].read &&
                user.stageProgress[stageKey].practice &&
                user.stageProgress[stageKey].notes;

            // If all stages complete, mark lesson as complete
            if (allStagesComplete && !user.completedLessons.includes(stageKey)) {
                user.completedLessons.push(stageKey);
            }

            // Check for achievements
            const newAchievements = checkAchievements(user);

            users[userIndex] = user;
            writeUsers(users);

            const { password: _, ...userWithoutPassword } = user;
            res.json({
                user: userWithoutPassword,
                earnedXP: xp,
                leveledUp,
                newLevel: leveledUp ? user.level : null,
                newAchievements,
                allStagesComplete
            });
        } else {
            const { password: _, ...userWithoutPassword } = user;
            res.json({ user: userWithoutPassword, earnedXP: 0, leveledUp: false, newAchievements: [], allStagesComplete: false });
        }
    } catch (error) {
        console.error('Error completing stage:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Complete a lesson
router.post('/complete-lesson', authMiddleware, (req, res) => {
    try {
        const { courseId, lessonId, xp, quizScore } = req.body;
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === req.userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[userIndex];
        const lessonKey = `${courseId}-${lessonId}`;

        // Initialize new fields if they don't exist
        if (!user.lastActivityDate) user.lastActivityDate = null;
        if (!user.longestStreak) user.longestStreak = 0;
        if (!user.unlockedLessons) user.unlockedLessons = [];

        // Check if lesson already completed
        if (!user.completedLessons.includes(lessonKey)) {
            const previousLevel = user.level;

            user.completedLessons.push(lessonKey);

            // Award XP (bonus for high quiz scores)
            let earnedXP = xp;
            if (quizScore >= 90) earnedXP = Math.round(xp * 1.2); // 20% bonus
            else if (quizScore >= 80) earnedXP = Math.round(xp * 1.1); // 10% bonus

            user.xp += earnedXP;

            // Level up logic (every 1000 XP = 1 level)
            const newLevel = Math.floor(user.xp / 1000) + 1;
            const leveledUp = newLevel > previousLevel;
            user.level = newLevel;

            // Update streak with date checking
            const today = new Date().toDateString();
            const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate).toDateString() : null;

            if (lastActivity !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toDateString();

                if (lastActivity === yesterdayStr) {
                    user.streak += 1;
                } else if (lastActivity !== today) {
                    user.streak = 1;
                }

                user.lastActivityDate = new Date().toISOString();

                if (user.streak > user.longestStreak) {
                    user.longestStreak = user.streak;
                }
            }

            // Check for achievements
            const newAchievements = checkAchievements(user);

            users[userIndex] = user;
            writeUsers(users);

            const { password: _, ...userWithoutPassword } = user;
            res.json({
                user: userWithoutPassword,
                earnedXP,
                leveledUp,
                newLevel: leveledUp ? newLevel : null,
                newAchievements
            });
        } else {
            const { password: _, ...userWithoutPassword } = user;
            res.json({ user: userWithoutPassword, earnedXP: 0, leveledUp: false, newAchievements: [] });
        }
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user progress for a course
router.get('/course/:courseId', authMiddleware, (req, res) => {
    try {
        const users = readUsers();
        const user = users.find(u => u.id === req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const courseId = req.params.courseId;
        const completedLessons = user.completedLessons
            .filter(l => l.startsWith(courseId))
            .map(l => l.replace(`${courseId}-`, ''));

        res.json({ completedLessons });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

function checkAchievements(user) {
    const newAchievements = [];
    const potentialAchievements = [
        // Lesson milestones
        { id: 'first-lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', condition: () => user.completedLessons.length === 1 },
        { id: '5-lessons', name: 'Getting Started', icon: '🌱', description: 'Complete 5 lessons', condition: () => user.completedLessons.length === 5 },
        { id: '10-lessons', name: 'Dedicated Learner', icon: '📚', description: 'Complete 10 lessons', condition: () => user.completedLessons.length === 10 },
        { id: '25-lessons', name: 'Knowledge Seeker', icon: '🔍', description: 'Complete 25 lessons', condition: () => user.completedLessons.length === 25 },
        { id: '50-lessons', name: 'Master Student', icon: '🎓', description: 'Complete 50 lessons', condition: () => user.completedLessons.length === 50 },

        // Level milestones
        { id: 'level-3', name: 'Novice', icon: '🥉', description: 'Reach level 3', condition: () => user.level === 3 },
        { id: 'level-5', name: 'Rising Star', icon: '⭐', description: 'Reach level 5', condition: () => user.level === 5 },
        { id: 'level-10', name: 'Expert', icon: '💎', description: 'Reach level 10', condition: () => user.level === 10 },

        // Streak milestones
        { id: '3-day-streak', name: 'Consistency', icon: '🔥', description: 'Maintain a 3-day streak', condition: () => user.streak === 3 },
        { id: '7-day-streak', name: 'Week Warrior', icon: '🔥', description: 'Maintain a 7-day streak', condition: () => user.streak === 7 },
        { id: '30-day-streak', name: 'Unstoppable', icon: '🚀', description: 'Maintain a 30-day streak', condition: () => user.streak === 30 },

        // XP milestones
        { id: '1000-xp', name: 'XP Hunter', icon: '⚡', description: 'Earn 1000 XP', condition: () => user.xp >= 1000 },
        { id: '5000-xp', name: 'XP Master', icon: '⚡', description: 'Earn 5000 XP', condition: () => user.xp >= 5000 },
    ];

    // Check each potential achievement
    potentialAchievements.forEach(achievement => {
        const alreadyUnlocked = user.achievements.find(a => a.id === achievement.id);
        if (!alreadyUnlocked && achievement.condition()) {
            const newAchievement = {
                id: achievement.id,
                name: achievement.name,
                icon: achievement.icon,
                description: achievement.description,
                unlockedAt: new Date().toISOString()
            };
            user.achievements.push(newAchievement);
            newAchievements.push(newAchievement);
        }
    });

    return newAchievements;
}

export default router;
