import React from 'react';
import InfoPage from '../components/InfoPage';

const Updates: React.FC = () => {
    return (
        <InfoPage title="Updates" lastUpdated="January 30, 2026">
            <div className="not-prose space-y-12 pl-4 md:pl-0">
                {/* v2.0 */}
                <div className="relative border-l-4 border-[#8BC34A] pl-8 pb-4">
                    <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#8BC34A] border-4 border-[#FAF3E0]"></div>
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-3xl font-bold text-[#2E7D32] m-0">v2.0</h2>
                        <span className="bg-[#8BC34A] text-white text-xs px-3 py-1 rounded-full uppercase font-bold tracking-widest shadow-sm">
                            The Content Expansion
                        </span>
                    </div>
                    <p className="text-[#689F38] font-bold mb-6 text-sm uppercase tracking-wide">January 2026</p>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DCEDC8]">
                            <h4 className="font-bold text-[#33691E] mb-2 flex items-center gap-2">🚀 Major Content Drop</h4>
                            <p className="text-[#558B2F]">Added comprehensive curricula for Web Dev, DSA, System Design, Python, ML, and Database Systems.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#DCEDC8]">
                            <h4 className="font-bold text-[#33691E] mb-2 flex items-center gap-2">🎨 Visual Overhaul</h4>
                            <p className="text-[#558B2F]">New mascot animations, colorful roadmap transitions, and immersive acorn celebrations.</p>
                        </div>
                    </div>
                </div>

                {/* v1.5 */}
                <div className="relative border-l-4 border-[#FFB74D] pl-8 pb-4">
                    <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#FFB74D] border-4 border-[#FAF3E0]"></div>
                    <h2 className="text-3xl font-bold text-[#E65100] mb-2">v1.5</h2>
                    <p className="text-[#EF6C00] font-bold mb-6 text-sm uppercase tracking-wide">January 2026 • Persistence Update</p>

                    <ul className="bg-[#FFF3E0] p-6 rounded-2xl border border-[#FFE0B2] space-y-2 text-[#E65100]">
                        <li className="flex gap-3">
                            <span>☁️</span> <strong>Cloud Sync:</strong> Progress, streaks, and favorites now sync across devices.
                        </li>
                        <li className="flex gap-3">
                            <span>📝</span> <strong>Notes:</strong> Save personal notes for each lesson directly in the app.
                        </li>
                    </ul>
                </div>

                {/* v1.0 */}
                <div className="relative border-l-4 border-[#BDBDBD] pl-8">
                    <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#BDBDBD] border-4 border-[#FAF3E0]"></div>
                    <h2 className="text-3xl font-bold text-[#616161] mb-2">v1.0</h2>
                    <p className="text-[#757575] font-bold mb-4 text-sm uppercase tracking-wide">December 2025 • Launch</p>
                    <p className="text-[#616161] italic">Initial release of NutriQuest with core gamification features.</p>
                </div>
            </div>
        </InfoPage>
    );
};

export default Updates;
