import React from 'react';
import Navbar from '../components/Navbar';

interface InfoPageProps {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, lastUpdated, children }) => {
    return (
        <div className="min-h-screen bg-[#FAF3E0] font-source-serif relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none"
                style={{ backgroundImage: 'url(/plaid.png)', backgroundSize: '200px' }}></div>

            <Navbar />

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#5D4037] mb-6 tracking-tight drop-shadow-sm">
                        {title}
                    </h1>
                    {lastUpdated && (
                        <div className="inline-block bg-[#8B4513]/10 px-4 py-2 rounded-full">
                            <p className="text-[#8B4513] font-bold text-sm uppercase tracking-widest">
                                Last Updated: {lastUpdated}
                            </p>
                        </div>
                    )}
                </header>

                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 md:p-16 shadow-[0_20px_50px_rgba(139,69,19,0.15)] border border-white/50 relative overflow-hidden">
                    {/* Decorative accent */}
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#8B4513]/20 to-transparent"></div>

                    <div className="prose prose-lg md:prose-xl prose-stone max-w-none 
                        prose-headings:text-[#5D4037] prose-headings:font-bold prose-headings:tracking-tight
                        prose-p:text-[#6D4C41] prose-p:leading-relaxed
                        prose-a:text-[#8B4513] prose-a:font-bold hover:prose-a:text-[#A1887F]
                        prose-strong:text-[#4E342E]
                        prose-ul:marker:text-[#8B4513]
                        prose-li:my-2">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InfoPage;
