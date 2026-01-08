import express from 'express';
import OpenAI from 'openai';
import { readCourses, writeCourses, readLessons, writeLessons } from '../utils/db.js';

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// AI Roadmap Generator with OpenAI
router.post('/generate-roadmap', async (req, res) => {
    try {
        const { goal, experience, timeCommitment, interests } = req.body;

        // Check if API key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OpenAI API key not configured, using fallback');
            return res.json({ roadmap: generateFallbackRoadmap(goal, experience, timeCommitment, interests) });
        }

        // Create the prompt for OpenAI
        const prompt = `You are an expert learning path designer. Create a personalized, gamified learning roadmap based on:

Goal: ${goal}
Experience Level: ${experience}
Time Commitment: ${timeCommitment} hours per week
Specific Interests: ${interests || 'None specified'}

Generate 3-4 lessons. Each lesson MUST have:
1. Read stage: Introduction + 2-3 sections with content
2. Practice stage: 3-4 multiple choice questions with explanations
3. Notes stage: Summary + 3-5 key takeaways

Return ONLY valid JSON (no markdown, no code blocks):
{
  "courseId": "ai-generated-${Date.now()}",
  "title": "Course title",
  "description": "Brief description",
  "icon": "🎯",
  "difficulty": "${experience}",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Lesson title",
      "xp": 100,
      "stages": {
        "read": {
          "xp": 20,
          "introduction": "Introduction text",
          "sections": [
            {
              "title": "Section title",
              "content": "Section content"
            }
          ]
        },
        "practice": {
          "xp": 50,
          "questions": [
            {
              "id": "q1",
              "difficulty": "easy",
              "xpReward": 15,
              "question": "Question text?",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
              "correctAnswer": 0,
              "explanation": "Explanation of correct answer"
            }
          ]
        },
        "notes": {
          "xp": 30,
          "summary": "Summary of the lesson",
          "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
        }
      }
    }
  ]
}`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency
            messages: [
                {
                    role: "system",
                    content: "You are an expert learning path designer who creates personalized, structured learning roadmaps. Always respond with valid JSON only, no markdown formatting."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" } // Force JSON response
        });

        // Parse the response
        let roadmapText = completion.choices[0].message.content.trim();
        console.log('GPT Raw Response:', roadmapText);

        // Remove markdown code blocks if present
        roadmapText = roadmapText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const roadmap = JSON.parse(roadmapText);
        console.log('Parsed Roadmap:', JSON.stringify(roadmap, null, 2));

        res.json({ roadmap });
    } catch (error) {
        console.error('Error generating roadmap:', error);

        // Fallback to mock implementation if OpenAI fails
        const { goal, experience, timeCommitment, interests } = req.body;
        const fallbackRoadmap = generateFallbackRoadmap(goal, experience, timeCommitment, interests);

        res.json({ roadmap: fallbackRoadmap });
    }
});

// Save AI-generated roadmap as a playable course
router.post('/save-course', async (req, res) => {
    try {
        console.log('📥 Received save-course request');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const { roadmap } = req.body;

        console.log('Extracted roadmap:', roadmap);
        console.log('Roadmap title:', roadmap?.title);
        console.log('Roadmap lessons:', roadmap?.lessons);

        if (!roadmap || !roadmap.title || !roadmap.lessons) {
            console.error('❌ Invalid roadmap data:', {
                hasRoadmap: !!roadmap,
                hasTitle: !!roadmap?.title,
                hasLessons: !!roadmap?.lessons
            });
            return res.status(400).json({ error: 'Invalid roadmap data' });
        }

        // Generate a unique course ID
        const courseId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Read existing courses and lessons
        const courses = readCourses();
        const allLessons = readLessons();

        // Create the new course object with lessons array
        const newCourse = {
            id: courseId,
            title: roadmap.title,
            description: roadmap.description || `AI-generated roadmap for ${roadmap.generatedFor || 'your learning goals'}`,
            icon: "🤖", // AI icon
            color: "from-purple-500 to-pink-500",
            difficulty: roadmap.difficulty || "Beginner",
            duration: roadmap.totalDuration || "Self-paced",
            totalLessons: roadmap.lessons.length,
            isAIGenerated: true,
            lessons: roadmap.lessons.map((lesson, index) => ({
                id: `lesson-${index + 1}`,
                title: lesson.title,
                xp: lesson.xp || 100,
                type: "lesson"
            }))
        };

        // Add the new course to courses array
        courses.push(newCourse);
        writeCourses(courses);

        // Create lessons object for this course
        const courseLessons = {};

        roadmap.lessons.forEach((lesson, index) => {
            const lessonId = `lesson-${index + 1}`;
            courseLessons[lessonId] = {
                id: lessonId,
                title: lesson.title,
                duration: lesson.duration || "30 min",
                xp: lesson.xp || 100,
                stages: lesson.stages || {
                    read: {
                        content: lesson.content || `# ${lesson.title}\n\nThis lesson covers the fundamentals of ${lesson.title}.`
                    },
                    practice: {
                        exercises: lesson.exercises || []
                    },
                    notes: {
                        content: lesson.notes || ""
                    }
                },
                quiz: lesson.quiz || {
                    questions: []
                }
            };
        });

        // Add lessons to the lessons file
        allLessons[courseId] = courseLessons;
        writeLessons(allLessons);

        console.log(`✅ AI-generated course saved: ${courseId}`);

        res.json({
            success: true,
            courseId,
            message: 'Course created successfully!'
        });

    } catch (error) {
        console.error('Error saving AI course:', error);
        res.status(500).json({ error: 'Failed to save course' });
    }
});

// Fallback roadmap generator (original mock implementation)
function generateFallbackRoadmap(goal, experience, timeCommitment, interests) {
    const domainKeywords = {
        'web': ['javascript', 'js', 'react', 'frontend', 'html', 'css', 'next.js', 'vue', 'angular', 'bootstrap', 'tailwind', 'typescript', 'ts', 'web'],
        'backend': ['node', 'express', 'python', 'django', 'flask', 'go', 'golang', 'rust', 'java', 'spring', 'sql', 'mongodb', 'postgresql', 'api', 'rest', 'backend', 'server'],
        'data-science': ['python', 'pandas', 'numpy', 'statistics', 'machine learning', 'ml', 'ai', 'data science', 'visualization', 'tableau', 'sql', 'spark', 'hadoop', 'scikit-learn', 'tensorflow', 'pytorch'],
        'mobile': ['react native', 'flutter', 'swift', 'ios', 'android', 'kotlin', 'dart', 'mobile'],
        'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'devops', 'deployment', 'ci/cd', 'cloud', 'infrastructure'],
        'cybersecurity': ['cybersecurity', 'hacking', 'penetration', 'encryption', 'security', 'firewall', 'linux', 'networks', 'wireshark', 'metasploit'],
        'game-dev': ['unity', 'unreal', 'c#', 'c++', 'game', 'graphics', 'shaders', 'directx', 'opengl', 'godot'],
        'ai-ml': ['ai', 'artificial intelligence', 'ml', 'gpt', 'llm', 'nlp', 'vision', 'neural', 'deep learning']
    };

    const userInput = `${goal} ${interests}`.toLowerCase();

    const detectedDomains = Object.keys(domainKeywords).filter(domain =>
        domainKeywords[domain].some(kw => {
            const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(userInput);
        })
    );

    const mainTopic = detectedDomains.length > 0 ? detectedDomains[0] : goal.split(' ').slice(-1)[0];

    const phases = [
        {
            phase: 1,
            title: `Foundations of ${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)}`,
            duration: '2-3 weeks',
            topics: Array.from(new Set([
                ...(interests.split(',').map(i => i.trim()).filter(i => i.length > 0).slice(0, 2)),
                'Basic Concepts',
                'Setting up Environment',
                'Key Principles'
            ]))
        },
        {
            phase: 2,
            title: `Intermediate ${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)} Mastery`,
            duration: '4-6 weeks',
            topics: Array.from(new Set([
                ...Object.values(domainKeywords).flat().filter(kw => {
                    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                    return regex.test(userInput);
                }).slice(0, 3),
                'Project-based Learning',
                'Core Patterns',
                'Optimization'
            ]))
        },
        {
            phase: 3,
            title: `Advanced ${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)} & Specialization`,
            duration: '6-8 weeks',
            topics: [
                'Production Readiness',
                'Scalability',
                'Deployment Strategies',
                'Final Project Portfolio'
            ]
        }
    ];

    const result = {
        title: `${goal.charAt(0).toUpperCase() + goal.slice(1)} Roadmap`,
        description: `A personalized learning path generated for: ${goal}`,
        phases: phases,
        generatedFor: {
            goal,
            experience,
            timeCommitment,
            interests
        },
        totalDuration: calculateTotalDuration(phases),
        createdAt: new Date().toISOString()
    };

    if (experience === 'beginner') {
        result.phases.forEach(phase => {
            phase.duration = phase.duration.replace(/(\d+)/g, (match) => parseInt(match) + 2);
        });
    } else if (experience === 'advanced') {
        result.phases.forEach(phase => {
            phase.duration = phase.duration.replace(/(\d+)/g, (match) => Math.max(1, parseInt(match) - 1));
        });
    }

    return result;
}

function calculateTotalDuration(phases) {
    const totalWeeks = phases.reduce((sum, phase) => {
        const weeks = phase.duration.match(/(\d+)-(\d+)/);
        if (weeks) {
            return sum + (parseInt(weeks[1]) + parseInt(weeks[2])) / 2;
        }
        return sum;
    }, 0);

    return `${Math.floor(totalWeeks / 4)}-${Math.ceil(totalWeeks / 4)} months`;
}


export default router;
