import React from 'react';
import InfoPage from '../components/InfoPage';

const Documentation: React.FC = () => {
    return (
        <InfoPage title="Documentation" lastUpdated="March 2026">
            <div className="not-prose">
                {/* Quick Start */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-[#5D4037] mb-8 flex items-center gap-3">
                        <span className="bg-[#FFF8E1] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🚀</span>
                        Getting Started
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { step: '01', title: 'Create Account', desc: 'Sign up with email or Google. Your adventure begins here.', color: 'from-[#FFF8E1] to-[#FFF3E0]', border: '#FFE082' },
                            { step: '02', title: 'Pick a Course', desc: 'Choose from Web Dev, Python, DSA, ML, System Design, and more.', color: 'from-[#E8F5E9] to-[#F1F8E9]', border: '#C5E1A5' },
                            { step: '03', title: 'Start Learning', desc: 'Follow the roadmap. Complete Read → Practice → Notes for each lesson.', color: 'from-[#E3F2FD] to-[#E8EAF6]', border: '#90CAF9' },
                        ].map(item => (
                            <div key={item.step} className={`bg-gradient-to-br ${item.color} p-8 rounded-3xl border border-[${item.border}] relative group hover:-translate-y-1 transition-all duration-300`}>
                                <span className="absolute top-4 right-4 text-5xl font-black opacity-10 text-[#5D4037]">{item.step}</span>
                                <h3 className="text-xl font-bold text-[#5D4037] mb-3">{item.title}</h3>
                                <p className="text-[#795548] leading-relaxed m-0">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Concepts */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-[#5D4037] mb-8 flex items-center gap-3">
                        <span className="bg-[#E8F5E9] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm">📖</span>
                        Core Concepts
                    </h2>
                    <div className="space-y-4">
                        {[
                            { icon: '🗺️', title: 'Learning Paths (Roadmaps)', desc: 'Structured curricula designed by experts. Each path takes you from beginner to advanced through a curated sequence of lessons.' },
                            { icon: '🏔️', title: 'Levels', desc: 'Major milestones within a roadmap. Each level groups related concepts together. Complete all lessons in a level to unlock the next.' },
                            { icon: '📝', title: 'Lessons', desc: 'Individual topics within a level. Each lesson has three stages that reinforce deep learning.' },
                            { icon: '🔄', title: 'Stages: Read → Practice → Notes', desc: 'Every lesson follows a three-stage cycle. Read the material, test yourself with practice, then solidify your understanding with personal notes.' },
                        ].map(item => (
                            <div key={item.title} className="flex gap-5 bg-white p-6 rounded-2xl border border-[#EFEBE9] shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-3xl flex-shrink-0 mt-1">{item.icon}</span>
                                <div>
                                    <h3 className="text-lg font-bold text-[#5D4037] mb-1 m-0">{item.title}</h3>
                                    <p className="text-[#795548] m-0 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gamification */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-[#5D4037] mb-8 flex items-center gap-3">
                        <span className="bg-[#E3F2FD] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🎮</span>
                        XP & Progression
                    </h2>
                    <div className="bg-gradient-to-br from-[#5D4037] to-[#4E342E] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-[#FFE082]">How XP Works</h3>
                                <ul className="space-y-4 m-0 p-0 list-none">
                                    {[
                                        'Complete a stage → earn XP',
                                        'Finish all 3 stages of a lesson → bonus XP',
                                        'Maintain daily streaks → streak multiplier',
                                        'Ace quizzes → extra XP rewards',
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-3 text-white/90">
                                            <span className="w-2 h-2 bg-[#FFE082] rounded-full flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-[#FFE082]">Level Up</h3>
                                <p className="text-white/80 leading-relaxed m-0 mb-4">
                                    Accumulate XP to level up your profile. Each level unlocks new achievements and showcases your dedication.
                                </p>
                                <div className="flex gap-3 flex-wrap">
                                    {['🌱 Sprout', '🌿 Sapling', '🌳 Oak', '🏔️ Summit', '⭐ Legend'].map(badge => (
                                        <span key={badge} className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border border-white/10">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Generator */}
                <div>
                    <h2 className="text-3xl font-bold text-[#5D4037] mb-8 flex items-center gap-3">
                        <span className="bg-[#F3E5F5] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🤖</span>
                        AI Roadmap Generator
                    </h2>
                    <div className="bg-gradient-to-r from-[#F3E5F5] to-[#E8EAF6] p-8 md:p-12 rounded-3xl border border-[#CE93D8]/30">
                        <p className="text-[#4A148C] text-lg leading-relaxed m-0 mb-6">
                            Can't find the course you want? Use the <strong>AI Generator</strong> to create a custom learning roadmap for <em>any</em> topic.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { step: 'Enter a topic', detail: '"Rust Programming" or "Quantum Computing"' },
                                { step: 'AI builds your path', detail: 'Structured levels and lessons generated instantly' },
                                { step: 'Start learning', detail: 'Your custom roadmap works exactly like built-in courses' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white/80">
                                    <div className="text-sm font-bold text-[#7B1FA2] uppercase tracking-wider mb-2">Step {i + 1}</div>
                                    <div className="font-bold text-[#4A148C] mb-1">{item.step}</div>
                                    <div className="text-sm text-[#7B1FA2]/70">{item.detail}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </InfoPage>
    );
};

export default Documentation;
