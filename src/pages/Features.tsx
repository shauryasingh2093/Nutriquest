import React from 'react';
import InfoPage from '../components/InfoPage';

const Features: React.FC = () => {
    return (
        <InfoPage title="Features" lastUpdated="January 30, 2026">
            <div className="not-prose grid gap-8 md:grid-cols-2 lg:grid-cols-3 -mx-4 md:-mx-8">
                {/* Gamified Learning */}
                <div className="bg-[#FFF8E1] p-8 rounded-3xl border border-[#FFE082] transition-transform hover:-translate-y-2 hover:shadow-lg">
                    <div className="text-4xl mb-4">🎮</div>
                    <h3 className="text-2xl font-bold text-[#5D4037] mb-3">Gamified Learning</h3>
                    <ul className="space-y-3 text-[#795548]">
                        <li className="flex items-start gap-2">
                            <span className="text-[#FFA000] font-bold">✓</span> Interactive Roadmaps
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#FFA000] font-bold">✓</span> XP & Levels System
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#FFA000] font-bold">✓</span> Daily Streak Tracking
                        </li>
                    </ul>
                </div>

                {/* Curriculum */}
                <div className="bg-[#E8F5E9] p-8 rounded-3xl border border-[#C5E1A5] transition-transform hover:-translate-y-2 hover:shadow-lg">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold text-[#2E7D32] mb-3">Rich Curriculum</h3>
                    <ul className="space-y-3 text-[#558B2F]">
                        <li className="flex items-start gap-2">
                            <span className="text-[#7CB342] font-bold">✓</span> Web Dev, Python, DSA
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#7CB342] font-bold">✓</span> System Design & ML
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#7CB342] font-bold">✓</span> Deep Dive Lessons
                        </li>
                    </ul>
                </div>

                {/* AI Power */}
                <div className="bg-[#E3F2FD] p-8 rounded-3xl border border-[#90CAF9] transition-transform hover:-translate-y-2 hover:shadow-lg">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-2xl font-bold text-[#1565C0] mb-3">AI Powered</h3>
                    <p className="text-[#1976D2] leading-relaxed">
                        Instantly generate custom roadmaps for ANY topic. Our AI builds a structured path just for you.
                    </p>
                </div>
            </div>

            <div className="mt-16 text-center">
                <h3 className="text-3xl font-bold text-[#5D4037] mb-6">And much more...</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {['Personal Notes', 'Cloud Sync', 'Dark Mode', 'Mobile Friendly', 'Progress Analytics'].map(tag => (
                        <span key={tag} className="bg-white border-2 border-[#8D6E63] text-[#5D4037] px-6 py-2 rounded-full font-bold text-sm tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </InfoPage>
    );
};

export default Features;
