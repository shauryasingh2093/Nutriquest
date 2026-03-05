import React from 'react';
import InfoPage from '../components/InfoPage';

const libraries = [
    { name: 'React', license: 'MIT', desc: 'UI component library', icon: '⚛️', url: 'https://react.dev' },
    { name: 'Vite', license: 'MIT', desc: 'Next-gen build tooling', icon: '⚡', url: 'https://vitejs.dev' },
    { name: 'Tailwind CSS', license: 'MIT', desc: 'Utility-first CSS framework', icon: '🎨', url: 'https://tailwindcss.com' },
    { name: 'Express', license: 'MIT', desc: 'Node.js web framework', icon: '🚂', url: 'https://expressjs.com' },
    { name: 'MongoDB', license: 'SSPL', desc: 'NoSQL database', icon: '🍃', url: 'https://mongodb.com' },
    { name: 'Mongoose', license: 'MIT', desc: 'MongoDB ODM', icon: '📦', url: 'https://mongoosejs.com' },
    { name: 'Passport.js', license: 'MIT', desc: 'Authentication middleware', icon: '🔐', url: 'https://passportjs.org' },
    { name: 'Axios', license: 'MIT', desc: 'HTTP client', icon: '🌐', url: 'https://axios-http.com' },
    { name: 'OpenAI', license: 'MIT', desc: 'AI integration SDK', icon: '🤖', url: 'https://openai.com' },
    { name: 'React Router', license: 'MIT', desc: 'Client-side routing', icon: '🗺️', url: 'https://reactrouter.com' },
];

const Licenses: React.FC = () => {
    return (
        <InfoPage title="Licenses & Credits" lastUpdated="March 2026">
            <div className="not-prose">
                {/* Open Source */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-[#5D4037] mb-3 flex items-center gap-3">
                        <span className="bg-[#E8F5E9] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm">📦</span>
                        Open Source Libraries
                    </h2>
                    <p className="text-[#795548] mb-8 leading-relaxed">
                        NutriQuest is built with these incredible open source projects. We're grateful for the community.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {libraries.map(lib => (
                            <a
                                key={lib.name}
                                href={lib.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#EFEBE9] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group"
                            >
                                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">{lib.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#5D4037] text-lg">{lib.name}</span>
                                        <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                            {lib.license}
                                        </span>
                                    </div>
                                    <span className="text-[#A1887F] text-sm">{lib.desc}</span>
                                </div>
                                <span className="text-[#A1887F] opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Credits */}
                <div className="bg-gradient-to-br from-[#5D4037] to-[#4E342E] rounded-3xl p-10 md:p-14 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-[#FFE082] mb-8 flex items-center gap-3">
                            <span className="text-3xl">✨</span> Credits
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-3">Design & Development</h3>
                                <p className="text-white/80 m-0 leading-relaxed">
                                    <strong className="text-[#FFE082]">Shaurya Singh</strong> — Full-stack development, game design, UI/UX design, and mascot character creation.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-3">Assets & Design</h3>
                                <p className="text-white/80 m-0 leading-relaxed">
                                    All squirrel mascots and game assets are original creations designed exclusively for NutriQuest. Icons follow Material Design standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* License Notice */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-[#A1887F] m-0">
                        NutriQuest © 2025–2026. All rights reserved. Built with ❤️ and open source.
                    </p>
                </div>
            </div>
        </InfoPage>
    );
};

export default Licenses;
