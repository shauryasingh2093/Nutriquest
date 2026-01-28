import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import { readCourses, readLessons } from '../utils/db.js';

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding');

        const courses = readCourses();
        const lessonsData = readLessons();

        // Clear existing courses
        await Course.deleteMany({});
        console.log('🗑️  Cleared existing courses');

        const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

        const coursesToSeed = courses.map(course => {
            const courseId = course.id;
            const lessons = lessonsData[courseId] || {};

            // Format lessons to match the schema
            const formattedLessons = Object.values(lessons).map(lesson => {
                const formatted = {
                    id: lesson.id,
                    title: lesson.title,
                    xp: lesson.totalXP || lesson.xp,
                    type: lesson.type,
                    difficulty: capitalize(lesson.difficulty || 'Easy'),
                    estimatedMinutes: lesson.estimatedMinutes || 30,
                    stages: {}
                };

                if (lesson.stages) {
                    if (lesson.stages.read) {
                        formatted.stages.read = {
                            ...lesson.stages.read,
                            xp: lesson.stages.read.xp || 10
                        };
                    }
                    if (lesson.stages.practice) {
                        formatted.stages.practice = {
                            ...lesson.stages.practice,
                            xp: lesson.stages.practice.xp || 30,
                            questions: (lesson.stages.practice.questions || []).map(q => ({
                                ...q,
                                difficulty: capitalize(q.difficulty || 'Easy'),
                                xpReward: q.xpReward || 10
                            }))
                        };
                    }
                    if (lesson.stages.notes) {
                        formatted.stages.notes = {
                            ...lesson.stages.notes,
                            xp: lesson.stages.notes.xp || 10
                        };
                    }
                }

                return formatted;
            });

            return {
                id: course.id,
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail || course.icon,
                category: course.category || 'General',
                difficulty: capitalize(course.difficulty || 'Beginner'),
                lessons: formattedLessons,
                totalXP: formattedLessons.reduce((sum, l) => sum + (l.xp || 0), 0)
            };
        });

        await Course.insertMany(coursesToSeed);
        console.log(`🌱 Successfully seeded ${coursesToSeed.length} courses!`);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seed();
