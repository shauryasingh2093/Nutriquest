import express from 'express';
import Course from '../models/Course.js';
import { authenticate } from '../middleware/auth.js';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const router = express.Router();

// Get lesson content
router.get('/:courseId/:lessonId', authenticate, async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;

        const course = await Course.findOne({ id: courseId });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex === -1) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        let lesson = course.lessons[lessonIndex];

        // If lesson content (stages) is missing, generate it using AI
        if (!lesson.stages || !lesson.stages.read || !lesson.stages.read.introduction) {
            console.log(`✨ Generating AI content for lesson: ${lesson.title} in course: ${course.title}`);

            try {
                const prompt = `Generate a comprehensive, gamified lesson for a Computer Science course.
Course: ${course.title}
Lesson: ${lesson.title}
Difficulty: ${course.difficulty || 'Beginner'}

Follow this exact structure and return ONLY valid JSON:
{
  "read": {
    "xp": 20,
    "introduction": "Engaging introduction to ${lesson.title}...",
    "sections": [
      {
        "title": "Core Concept",
        "content": "Detailed explanation...",
        "keyPoints": ["Point 1", "Point 2"],
        "example": {
          "code": "code snippet example",
          "explanation": "explanation of code"
        }
      },
      {
        "title": "Advanced View",
        "content": "Continuing depth...",
        "keyPoints": ["Point 3"]
      }
    ]
  },
  "practice": {
    "xp": 50,
    "questions": [
      {
        "id": "q1",
        "difficulty": "${course.difficulty || 'Beginner'}",
        "xpReward": 15,
        "question": "A relevant challenge question?",
        "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
        "correctAnswer": 0,
        "explanation": "Detailed explanation of why A is correct."
      },
      {
        "id": "q2",
        "difficulty": "${course.difficulty || 'Beginner'}",
        "xpReward": 15,
        "question": "Another challenge?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 1,
        "explanation": "Explanation..."
      },
      {
        "id": "q3",
        "difficulty": "${course.difficulty || 'Beginner'}",
        "xpReward": 20,
        "question": "Final tricky question?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 2,
        "explanation": "Explanation..."
      }
    ]
  },
  "notes": {
    "xp": 30,
    "summary": "Concise summary of everything learned.",
    "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
  }
}`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are an expert technical educator. Return only valid JSON." },
                        { role: "user", content: prompt }
                    ],
                    response_format: { type: "json_object" }
                });

                const generatedContent = JSON.parse(completion.choices[0].message.content);

                // Capitalize difficulty for schema validation
                if (generatedContent.practice && generatedContent.practice.questions) {
                    generatedContent.practice.questions = generatedContent.practice.questions.map(q => ({
                        ...q,
                        difficulty: q.difficulty ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1).toLowerCase() : 'Beginner'
                    }));
                }

                // Update the lesson in the course
                course.lessons[lessonIndex].stages = generatedContent;
                await course.save();

                lesson = course.lessons[lessonIndex];
            } catch (aiError) {
                console.error('❌ AI Generation failed:', aiError);
                // Return original lesson stub if AI fails
            }
        }

        res.json({ lesson });
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Submit quiz answers
router.post('/:courseId/:lessonId/submit-quiz', authenticate, async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const { answers } = req.body;

        const course = await Course.findOne({ id: courseId });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const lesson = course.lessons.find(l => l.id === lessonId);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const questions = lesson.stages.practice.questions;

        // Calculate score
        let correctCount = 0;
        const results = answers.map((answer, index) => {
            const question = questions[index];
            if (!question) return null;

            const isCorrect = answer === question.correctAnswer;
            if (isCorrect) correctCount++;

            return {
                questionId: question.id,
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            };
        }).filter(r => r !== null);

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
