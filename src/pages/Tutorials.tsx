import React from 'react';
import InfoPage from '../components/InfoPage';

const tutorials = [
    {
        icon: '🗺️',
        title: 'How to Start a Course',
        color: 'from-[#FFF8E1] to-[#FFF3E0]',
        accent: '#FFA000',
        textColor: '#E65100',
        steps: [
            'Go to the **Courses** page from the dashboard.',
            'Click on a topic card (e.g., Web Development).',
            'Press **Start** to begin your roadmap at Level 0.',
            'Complete each lesson stage: Read → Practice → Notes.',
        ],
    },
    {
        icon: '🔥',
        title: 'How to Maintain a Streak',
        color: 'from-[#FBE9E7] to-[#FFCCBC]',
        accent: '#FF5722',
        textColor: '#BF360C',
        steps: [
            'Complete at least **one lesson stage** every day.',
            'A flame icon in the top right shows your current streak.',
            'Streaks reset if you miss a full day — consistency is key!',
            'Longer streaks unlock special achievements and bonus XP.',
        ],
    },
    {
        icon: '🤖',
        title: 'Using the AI Generator',
        color: 'from-[#F3E5F5] to-[#E8EAF6]',
        accent: '#9C27B0',
        textColor: '#4A148C',
        steps: [
            'Navigate to the **AI Generator** page from the sidebar.',
            'Type any topic you want to learn (e.g., "Blockchain Basics").',
            'Click **Generate** and wait a few seconds.',
            'Your custom roadmap will appear — start learning immediately!',
        ],
    },
    {
        icon: '📝',
        title: 'Taking & Managing Notes',
        color: 'from-[#E8F5E9] to-[#F1F8E9]',
        accent: '#4CAF50',
        textColor: '#1B5E20',
        steps: [
            'Open any lesson and navigate to the **Notes** stage.',
            'Write your personal notes to reinforce what you learned.',
            'Notes are saved to your account and sync across devices.',
            'Use the calendar view to add daily study notes and reflections.',
        ],
    },
    {
        icon: '⭐',
        title: 'Earning Achievements',
        color: 'from-[#E3F2FD] to-[#E8EAF6]',
        accent: '#1976D2',
        textColor: '#0D47A1',
        steps: [
            'Achievements unlock automatically as you hit milestones.',
            'Complete courses, maintain streaks, and level up to earn them.',
            'View all your earned badges on the **Profile** page.',
            'Some achievements are hidden — explore to discover them!',
        ],
    },
    {
        icon: '❤️',
        title: 'Using Favorites',
        color: 'from-[#FCE4EC] to-[#F8BBD0]',
        accent: '#E91E63',
        textColor: '#880E4F',
        steps: [
            'Click the heart icon on any course or lesson to favorite it.',
            'Access your favorites from the **Profile** page for quick review.',
            'Favorites sync across devices so you never lose track.',
            'Use favorites to bookmark lessons you want to revisit later.',
        ],
    },
];

const Tutorials: React.FC = () => {
    return (
        <InfoPage title="Tutorials" lastUpdated="March 2026">
            <div className="not-prose">
                <p className="text-center text-xl text-[#795548] mb-12 max-w-2xl mx-auto leading-relaxed">
                    Step-by-step guides to help you get the most out of NutriQuest. Follow along and become a pro!
                </p>

                <div className="space-y-8">
                    {tutorials.map((tutorial, idx) => (
                        <div
                            key={idx}
                            className={`bg-gradient-to-br ${tutorial.color} rounded-3xl p-8 md:p-10 border border-white/50 shadow-sm hover:shadow-md transition-all`}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl">{tutorial.icon}</span>
                                <h2 className="text-2xl font-bold m-0" style={{ color: tutorial.textColor }}>
                                    {tutorial.title}
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {tutorial.steps.map((step, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/80"
                                    >
                                        <span
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
                                            style={{ backgroundColor: tutorial.accent }}
                                        >
                                            {i + 1}
                                        </span>
                                        <p
                                            className="m-0 leading-relaxed font-medium"
                                            style={{ color: tutorial.textColor }}
                                            dangerouslySetInnerHTML={{
                                                __html: step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </InfoPage>
    );
};

export default Tutorials;
