import express from 'express';
import User from '../models/User.js';
import { updateUserStreak } from '../utils/streakHelper.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Complete a stage
router.post('/complete-stage', authenticate, async (req, res) => {
    try {
        const { courseId, lessonId, stage, xp, content } = req.body;
        const user = req.user;
        const stageKey = `${courseId}-${lessonId}`;

        // Initialize stage progress if not exists
        if (!user.stageProgress) user.stageProgress = new Map();

        let progress = user.stageProgress.get(stageKey);
        console.log(`[DEBUG] Completing stage: ${stage} for ${stageKey}`);
        console.log(`[DEBUG] Current progress for key:`, progress);
        if (!progress) {
            progress = {
                read: false,
                practice: false,
                notes: false,
                userNotes: ""
            };
        }

        // Mark stage as complete if not already, or update notes
        const isFirstTime = !progress[stage];
        const isNotesUpdate = stage === 'notes' && content !== undefined;

        if (isFirstTime || isNotesUpdate) {
            if (isFirstTime) {
                progress[stage] = true;
                user.xp += (xp || 0);
            }

            if (isNotesUpdate) {
                progress.userNotes = content;
            }

            user.stageProgress.set(stageKey, progress);
            user.markModified('stageProgress');

            const allStagesComplete = !!(progress.read && progress.practice && progress.notes);

            const previousLevel = user.level;
            user.level = Math.floor(user.xp / 1000) + 1;
            const leveledUp = user.level > previousLevel;

            const { updated, user: updatedUserData } = updateUserStreak(user.toObject());
            if (updated) {
                user.streak = updatedUserData.streak;
                user.lastActivityDate = updatedUserData.lastActivityDate;
                user.longestStreak = updatedUserData.longestStreak;
            }

            if (allStagesComplete && !user.completedLessons.includes(stageKey)) {
                user.completedLessons.push(stageKey);
            }

            const newAchievements = checkAchievements(user);

            await user.save();

            res.json({
                user,
                earnedXP: isFirstTime ? xp : 0,
                leveledUp,
                newLevel: leveledUp ? user.level : null,
                newAchievements,
                allStagesComplete
            });
        } else {
            const allStagesComplete = !!(progress.read && progress.practice && progress.notes);
            res.json({ user, earnedXP: 0, leveledUp: false, newAchievements: [], allStagesComplete });
        }
    } catch (error) {
        console.error('Error completing stage:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Complete a lesson
router.post('/complete-lesson', authenticate, async (req, res) => {
    try {
        const { courseId, lessonId, xp, quizScore } = req.body;
        const user = req.user;
        const lessonKey = `${courseId}-${lessonId}`;

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

            // Update streak
            const { updated, user: updatedUserData } = updateUserStreak(user.toObject());
            if (updated) {
                user.streak = updatedUserData.streak;
                user.lastActivityDate = updatedUserData.lastActivityDate;
                user.longestStreak = updatedUserData.longestStreak;
            }

            // Check for achievements
            const newAchievements = checkAchievements(user);

            await user.save();

            res.json({
                user,
                earnedXP,
                leveledUp,
                newLevel: leveledUp ? newLevel : null,
                newAchievements
            });
        } else {
            res.json({ user, earnedXP: 0, leveledUp: false, newAchievements: [] });
        }
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user progress for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
    try {
        const user = req.user;
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

// Update course history
router.post('/history', authenticate, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = req.user;

        // Move to front if exists, else prepend
        user.history = [courseId, ...user.history.filter(id => id !== courseId)].slice(0, 10);
        await user.save();
        res.json({ history: user.history });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle favorite
router.post('/favorite', authenticate, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = req.user;

        if (user.favorites.includes(courseId)) {
            user.favorites = user.favorites.filter(id => id !== courseId);
        } else {
            user.favorites.push(courseId);
        }

        await user.save();
        res.json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add calendar note
router.post('/notes', authenticate, async (req, res) => {
    try {
        const { dateKey, note } = req.body;
        const user = req.user;

        if (!user.calendarNotes) user.calendarNotes = new Map();

        const existingNotes = user.calendarNotes.get(dateKey) || [];
        user.calendarNotes.set(dateKey, [...existingNotes, note]);

        await user.save();
        res.json({ calendarNotes: user.calendarNotes });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete calendar note
router.delete('/notes', authenticate, async (req, res) => {
    try {
        const { dateKey, noteIndex } = req.body;
        const user = req.user;

        if (user.calendarNotes && user.calendarNotes.has(dateKey)) {
            const notes = user.calendarNotes.get(dateKey);
            notes.splice(noteIndex, 1);
            if (notes.length === 0) {
                user.calendarNotes.delete(dateKey);
            } else {
                user.calendarNotes.set(dateKey, notes);
            }
            await user.save();
        }
        res.json({ calendarNotes: user.calendarNotes });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

function checkAchievements(user) {
    const newAchievements = [];
    const potentialAchievements = [
        // Lesson milestones
        { id: 'first-lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', condition: () => user.completedLessons.length >= 1 },
        { id: '5-lessons', name: 'Getting Started', icon: '🌱', description: 'Complete 5 lessons', condition: () => user.completedLessons.length >= 5 },
        { id: '10-lessons', name: 'Dedicated Learner', icon: '📚', description: 'Complete 10 lessons', condition: () => user.completedLessons.length >= 10 },
        { id: '25-lessons', name: 'Knowledge Seeker', icon: '🔍', description: 'Complete 25 lessons', condition: () => user.completedLessons.length >= 25 },
        { id: '50-lessons', name: 'Master Student', icon: '🎓', description: 'Complete 50 lessons', condition: () => user.completedLessons.length >= 50 },

        // Level milestones
        { id: 'level-3', name: 'Novice', icon: '🥉', description: 'Reach level 3', condition: () => user.level >= 3 },
        { id: 'level-5', name: 'Rising Star', icon: '⭐', description: 'Reach level 5', condition: () => user.level >= 5 },
        { id: 'level-10', name: 'Expert', icon: '💎', description: 'Reach level 10', condition: () => user.level >= 10 },

        // Streak milestones
        { id: '3-day-streak', name: 'Consistency', icon: '🔥', description: 'Maintain a 3-day streak', condition: () => user.streak >= 3 },
        { id: '7-day-streak', name: 'Week Warrior', icon: '🔥', description: 'Maintain a 7-day streak', condition: () => user.streak >= 7 },
        { id: '30-day-streak', name: 'Unstoppable', icon: '🚀', description: 'Maintain a 30-day streak', condition: () => user.streak >= 30 },

        // XP milestones
        { id: '1000-xp', name: 'XP Hunter', icon: '⚡', description: 'Earn 1000 XP', condition: () => user.xp >= 1000 },
        { id: '5000-xp', name: 'XP Master', icon: '⚡', description: 'Earn 5000 XP', condition: () => user.xp >= 5000 }
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
                unlockedAt: new Date()
            };
            user.achievements.push(newAchievement);
            newAchievements.push(newAchievement);
        }
    });

    return newAchievements;
}

export default router;
