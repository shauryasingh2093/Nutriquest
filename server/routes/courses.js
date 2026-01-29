import express from 'express';
import Course from '../models/Course.js';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
    try {
        // Project only necessary fields - exclude lessons' stages which can be very large
        const courses = await Course.find({})
            .select('id title description thumbnail category difficulty totalXP isAIGenerated lessons.id lessons.title lessons.xp')
            .sort({ createdAt: -1 })
            .lean();

        // Remove duplicates by title (keep the first occurrence) 
        const seen = new Set();
        const uniqueCourses = courses.filter((course) => {
            if (seen.has(course.title)) return false;
            seen.add(course.title);
            return true;
        });

        res.json({ courses: uniqueCourses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get specific course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findOne({ id: req.params.id });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // If the course has no lessons, generate them using AI!
        if (course.lessons.length === 0) {
            console.log(`🚀 Dynamically generating roadmap for course: ${course.title}`);

            try {
                const prompt = `You are a learning path designer. Generate a list of 5 essential lessons for a Computer Science course.
Course Title: ${course.title}
Course Description: ${course.description}
Difficulty: ${course.difficulty || 'Beginner'}

Return ONLY a valid JSON object with the following structure:
{
  "lessons": [
    {
      "id": "unique-lesson-id-1",
      "title": "Lesson Title 1",
      "xp": 100,
      "estimatedMinutes": 20
    },
    ...
  ]
}`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a helpful expert in Computer Science education. Respond only with JSON." },
                        { role: "user", content: prompt }
                    ],
                    response_format: { type: "json_object" }
                });

                const data = JSON.parse(completion.choices[0].message.content);

                if (data.lessons && Array.isArray(data.lessons)) {
                    // Map generated lessons to schema and ensure IDs are clean
                    const formattedLessons = data.lessons.map((l, idx) => ({
                        id: l.id || `lesson-${idx + 1}`,
                        title: l.title,
                        xp: l.xp || 100,
                        type: 'lesson',
                        difficulty: course.difficulty || 'Beginner',
                        estimatedMinutes: l.estimatedMinutes || 30,
                        stages: {} // Content will be generated when lesson is clicked
                    }));

                    course.lessons = formattedLessons;
                    await course.save();
                    console.log(`✅ Roadmap generated and saved for ${course.title}`);
                }
            } catch (aiError) {
                console.error('❌ AI Roadmap generation failed:', aiError);
                // Continue with missing contents if AI fails
            }
        }

        res.json({ course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
