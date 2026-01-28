/**
 * Streak Helper Functions
 * Handles streak calculation and updates for user activity tracking
 */

/**
 * Updates user streak based on activity dates
 * Only updates if user hasn't been active today yet
 * @param {Object} user - User object with lastActivityDate and streak
 * @returns {Object} - { updated: boolean, user: Object, streakChanged: boolean }
 */
export function updateUserStreak(user) {
    const today = new Date().toDateString();
    const lastActivity = user.lastActivityDate
        ? new Date(user.lastActivityDate).toDateString()
        : null;

    console.log('[Streak] Checking streak update:', { today, lastActivity, currentStreak: user.streak });

    // If already active today, no need to update
    if (lastActivity === today) {
        console.log('[Streak] Already active today, no update needed');
        return { updated: false, user, streakChanged: false };
    }

    const previousStreak = user.streak || 0;

    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // Update streak based on last activity
    if (lastActivity === yesterdayStr) {
        // Consecutive day - increment streak
        user.streak = (user.streak || 0) + 1;
        console.log('[Streak] Consecutive day! Incrementing streak to:', user.streak);
    } else {
        // Streak broken or first activity - reset to 1
        user.streak = 1;
        console.log('[Streak] Streak broken or first activity. Resetting to 1. Last activity was:', lastActivity);
    }

    // Update last activity date
    user.lastActivityDate = new Date().toISOString();

    // Update longest streak if needed
    if (!user.longestStreak) user.longestStreak = 0;
    if (user.streak > user.longestStreak) {
        user.longestStreak = user.streak;
    }

    const streakChanged = user.streak !== previousStreak;

    console.log('[Streak] Update complete:', {
        newStreak: user.streak,
        previousStreak,
        streakChanged,
        longestStreak: user.longestStreak
    });

    return { updated: true, user, streakChanged };
}

/**
 * Checks if user's streak should be broken due to inactivity
 * Call this when fetching user data to detect broken streaks
 * @param {Object} user - User object with lastActivityDate and streak
 * @returns {Object} - { streakBroken: boolean, user: Object }
 */
export function checkStreakStatus(user) {
    const today = new Date().toDateString();
    const lastActivity = user.lastActivityDate
        ? new Date(user.lastActivityDate).toDateString()
        : null;

    // If active today, streak is fine
    if (lastActivity === today) {
        return { streakBroken: false, user };
    }

    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // If last activity was yesterday, streak is still alive (user has time today)
    if (lastActivity === yesterdayStr) {
        return { streakBroken: false, user };
    }

    // If last activity was more than a day ago, streak is broken
    if (lastActivity && lastActivity !== yesterdayStr && lastActivity !== today) {
        const previousStreak = user.streak;
        user.streak = 0; // Reset to 0 to indicate broken streak
        return { streakBroken: true, user, previousStreak };
    }

    return { streakBroken: false, user };
}

/**
 * Calculates days since last activity
 * @param {string} lastActivityDate - ISO date string
 * @returns {number} - Number of days since last activity
 */
export function daysSinceLastActivity(lastActivityDate) {
    if (!lastActivityDate) return Infinity;

    const today = new Date();
    const lastActivity = new Date(lastActivityDate);
    const diffTime = Math.abs(today - lastActivity);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}
