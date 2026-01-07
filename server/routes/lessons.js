import express from 'express';
import jwt from 'jsonwebtoken';
import { readLessons } from '../utils/db.js';

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

// Get lesson content
router.get('/:courseId/:lessonId', authMiddleware, (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const lessons = readLessons();

        if (!lessons[courseId] || !lessons[courseId][lessonId]) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const lesson = lessons[courseId][lessonId];
        res.json({ lesson });
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Submit quiz answers
router.post('/:courseId/:lessonId/submit-quiz', authMiddleware, (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const { answers } = req.body;
        const lessons = readLessons();

        if (!lessons[courseId] || !lessons[courseId][lessonId]) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const lesson = lessons[courseId][lessonId];
        const questions = lesson.quiz.questions;

        // Calculate score
        let correctCount = 0;
        const results = answers.map((answer, index) => {
            const question = questions[index];
            const isCorrect = answer === question.correctAnswer;
            if (isCorrect) correctCount++;

            return {
                questionId: question.id,
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            };
        });

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 70; // 70% passing grade

        res.json({
            score,
            passed,
            correctCount,
            totalQuestions: questions.length,
            results
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
