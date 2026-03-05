import React from 'react';
import InfoPage from '../components/InfoPage';

const sections = [
    {
        icon: '👋',
        number: '1',
        title: 'Introduction',
        color: 'from-[#E3F2FD] to-[#E8EAF6]',
        content: 'Welcome to NutriQuest. We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our learning platform.',
    },
    {
        icon: '📊',
        number: '2',
        title: 'Data We Collect',
        color: 'from-[#E8F5E9] to-[#F1F8E9]',
        content: null,
        items: [
            { label: 'Account Info', detail: 'Name and email address for authentication' },
            { label: 'Learning Progress', detail: 'Course completions, quiz scores, and XP earned' },
            { label: 'User Content', detail: 'Personal notes, favorites, and calendar entries' },
            { label: 'Usage Data', detail: 'Streak data and feature interaction for improving UX' },
        ],
    },
    {
        icon: '🔒',
        number: '3',
        title: 'How We Use Your Data',
        color: 'from-[#FFF8E1] to-[#FFF3E0]',
        content: null,
        items: [
            { label: 'Personalization', detail: 'Track and display your learning journey and progress' },
            { label: 'Roadmaps', detail: 'Generate personalized AI roadmaps based on your interests' },
            { label: 'Improvement', detail: 'Analyze usage patterns to improve course content and UX' },
            { label: 'Sync', detail: 'Sync your data across devices so you can learn anywhere' },
        ],
    },
    {
        icon: '🛡️',
        number: '4',
        title: 'Data Protection',
        color: 'from-[#F3E5F5] to-[#E8EAF6]',
        content: 'Your data is encrypted in transit and at rest. We use industry-standard security measures including secure authentication, JWT tokens, and encrypted database connections. We never sell your personal data to third parties.',
    },
    {
        icon: '🍪',
        number: '5',
        title: 'Cookies & Storage',
        color: 'from-[#FBE9E7] to-[#FFCCBC]',
        content: 'We use essential cookies and local storage to maintain your session, remember your preferences, and keep you logged in. We do not use tracking cookies or third-party advertising cookies.',
    },
    {
        icon: '✉️',
        number: '6',
        title: 'Contact Us',
        color: 'from-[#E0F2F1] to-[#E8F5E9]',
        content: 'If you have questions about this privacy policy or want to request data deletion, please contact us at privacy@nutriquest.com. We will respond within 48 hours.',
    },
];

const PrivacyPolicy: React.FC = () => {
    return (
        <InfoPage title="Privacy Policy" lastUpdated="March 2026">
            <div className="not-prose">
                <p className="text-center text-lg text-[#795548] mb-12 max-w-2xl mx-auto leading-relaxed">
                    Your privacy matters. Here's exactly how NutriQuest handles your data — no legalese, just clarity.
                </p>

                <div className="space-y-6">
                    {sections.map((section) => (
                        <div key={section.number} className={`bg-gradient-to-br ${section.color} rounded-3xl p-8 md:p-10 border border-white/50`}>
                            <div className="flex items-center gap-4 mb-5">
                                <span className="bg-white/70 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                                    {section.icon}
                                </span>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">Section {section.number}</span>
                                    <h2 className="text-2xl font-bold text-[#5D4037] m-0">{section.title}</h2>
                                </div>
                            </div>
                            {section.content && (
                                <p className="text-[#795548] leading-relaxed m-0 ml-16">{section.content}</p>
                            )}
                            {section.items && (
                                <div className="grid md:grid-cols-2 gap-3 ml-16">
                                    {section.items.map((item) => (
                                        <div key={item.label} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/80">
                                            <div className="font-bold text-[#5D4037] text-sm mb-1">{item.label}</div>
                                            <div className="text-[#795548] text-sm">{item.detail}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </InfoPage>
    );
};

export default PrivacyPolicy;
