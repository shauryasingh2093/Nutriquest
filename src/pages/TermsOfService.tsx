import React from 'react';
import InfoPage from '../components/InfoPage';

const terms = [
    {
        icon: '✅',
        number: '1',
        title: 'Acceptance of Terms',
        content: 'By accessing and using NutriQuest, you accept and agree to be bound by these terms. If you disagree with any part, please do not use the platform.',
        highlight: false,
    },
    {
        icon: '📚',
        number: '2',
        title: 'Educational Content',
        content: 'NutriQuest is an educational platform designed to help you learn programming and technology concepts. While we strive for accuracy, all content is for educational purposes only and should not be considered professional advice.',
        highlight: false,
    },
    {
        icon: '👤',
        number: '3',
        title: 'User Accounts',
        content: 'You are responsible for maintaining the confidentiality of your account credentials. You must not share your account with others. All activities under your account are your responsibility.',
        highlight: true,
    },
    {
        icon: '🎯',
        number: '4',
        title: 'Acceptable Use',
        content: 'You agree to use NutriQuest only for lawful educational purposes. You must not attempt to hack, exploit, or disrupt the platform. Automated scraping of content is prohibited.',
        highlight: false,
    },
    {
        icon: '🤖',
        number: '5',
        title: 'AI Generated Content',
        content: 'Roadmaps created by the AI Generator are algorithmically generated and may not always be perfect. NutriQuest is not responsible for inaccuracies in AI-generated learning paths. Use your judgement when following AI-generated content.',
        highlight: true,
    },
    {
        icon: '📊',
        number: '6',
        title: 'Progress & Data',
        content: 'Your learning progress, XP, streaks, and achievements are stored in our database. While we make every effort to preserve your data, we cannot guarantee against data loss in extraordinary circumstances.',
        highlight: false,
    },
    {
        icon: '🔄',
        number: '7',
        title: 'Changes to Terms',
        content: 'We may update these terms from time to time. Continued use of NutriQuest after changes constitutes acceptance of the new terms. We will notify users of significant changes via the Updates page.',
        highlight: false,
    },
];

const TermsOfService: React.FC = () => {
    return (
        <InfoPage title="Terms of Service" lastUpdated="March 2026">
            <div className="not-prose">
                <p className="text-center text-lg text-[#795548] mb-12 max-w-2xl mx-auto leading-relaxed">
                    Simple, fair terms for using NutriQuest. We keep it straightforward so you can focus on learning.
                </p>

                <div className="space-y-4">
                    {terms.map((term) => (
                        <div
                            key={term.number}
                            className={`rounded-3xl p-7 md:p-8 border transition-all hover:shadow-md ${term.highlight
                                    ? 'bg-[#FFF8E1] border-[#FFE082]/50'
                                    : 'bg-white border-[#EFEBE9]'
                                }`}
                        >
                            <div className="flex items-start gap-5">
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 bg-[#FAF3E0] rounded-2xl flex items-center justify-center relative">
                                        <span className="text-2xl">{term.icon}</span>
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B4513] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {term.number}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#5D4037] mb-2 m-0">{term.title}</h2>
                                    <p className="text-[#795548] leading-relaxed m-0">{term.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-sm text-[#A1887F]">
                    <p className="m-0">Questions about these terms? Contact us at <strong className="text-[#8B4513]">legal@nutriquest.com</strong></p>
                </div>
            </div>
        </InfoPage>
    );
};

export default TermsOfService;
