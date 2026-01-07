import express from 'express';

const router = express.Router();

// AI Roadmap Generator (Mock implementation)
router.post('/generate-roadmap', async (req, res) => {
    try {
        const { goal, experience, timeCommitment, interests } = req.body;

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate a personalized roadmap based on inputs
        const roadmap = generatePersonalizedRoadmap(goal, experience, timeCommitment, interests);

        res.json({ roadmap });
    } catch (error) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

function generatePersonalizedRoadmap(goal, experience, timeCommitment, interests) {
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

    // Extract keywords from goal and interests
    const userInput = `${goal} ${interests}`.toLowerCase();

    const detectedDomains = Object.keys(domainKeywords).filter(domain =>
        domainKeywords[domain].some(kw => {
            const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(userInput);
        })
    );

    // If no domain detected, try to use the goal itself as a keyword base
    const mainTopic = detectedDomains.length > 0 ? detectedDomains[0] : goal.split(' ').slice(-1)[0];

    // Dynamic Phase Generator
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

    // Adjust based on experience level
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
