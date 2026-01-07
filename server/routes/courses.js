import express from 'express';
import { readCourses } from '../utils/db.js';

const router = express.Router();

// Get all courses
router.get('/', (req, res) => {
    try {
        const courses = readCourses();
        res.json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get specific course
router.get('/:id', (req, res) => {
    try {
        const courses = readCourses();
        const course = courses.find(c => c.id === req.params.id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
