import React from 'react';
import InfoPage from '../components/InfoPage';

const About: React.FC = () => {
    return (
        <InfoPage title="About NutriQuest" lastUpdated="January 30, 2026">
            <div className="not-prose">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <h2 className="text-3xl font-bold text-[#5D4037] mb-6">Learning as an Adventure</h2>
                        <p className="text-xl text-[#795548] leading-relaxed mb-6">
                            NutriQuest was born from a simple idea: <strong>Learning should be an adventure, not a chore.</strong>
                        </p>
                        <p className="text-lg text-[#8D6E63] leading-relaxed">
                            We believe that by combining rigorous educational content with the satisfying mechanics of games—progression, rewards, streaks, and storytelling—we can help learners build consistent habits and achieve their goals.
                        </p>
                    </div>
                    <div className="bg-white/50 rounded-full p-12 aspect-square flex items-center justify-center border-4 border-[#5D4037]/10 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#8B4513]/10 to-transparent rounded-full animate-pulse-slow"></div>
                        <img src="/1.png" alt="NutriQuest Mascot" className="w-full max-w-[300px] drop-shadow-2xl hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {[
                        { title: 'Fun First', desc: 'We prioritize engagement. If it’s not fun, it’s not NutriQuest.', icon: '🎢' },
                        { title: 'Deep Learning', desc: 'Gamification is the hook; deep, structured knowledge is the reward.', icon: '🧠' },
                        { title: 'Community', desc: 'A forest grows together. We support every learner on their journey.', icon: '🌳' }
                    ].map(val => (
                        <div key={val.title} className="bg-white p-8 rounded-3xl shadow-sm border border-[#EFEBE9] text-center">
                            <div className="text-4xl mb-4">{val.icon}</div>
                            <h3 className="text-xl font-bold text-[#5D4037] mb-2">{val.title}</h3>
                            <p className="text-[#8D6E63]">{val.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-[#5D4037] text-[#FAF3E0] rounded-[40px] p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet the Creator</h2>
                        <div className="mb-6">
                            <span className="text-2xl font-bold bg-white/10 px-6 py-2 rounded-full inline-block backdrop-blur-sm">Shaurya Singh</span>
                        </div>
                        <p className="text-xl max-w-2xl mx-auto opacity-90 leading-relaxed font-light">
                            "I built NutriQuest with a vision to make learning accessible, engaging, and genuinely fun for everyone. Every line of code and every acorn was crafted with passion."
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                </div>
            </div>
        </InfoPage>
    );
};

export default About;
