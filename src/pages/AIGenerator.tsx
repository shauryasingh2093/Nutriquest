import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

interface AIFormData {
    goal: string;
    experience: 'beginner' | 'intermediate' | 'advanced';
    timeCommitment: string;
    interests: string;
}

interface AIPhase {
    phase: number;
    title: string;
    duration: string;
    topics: string[];
}

interface AILesson {
    id: string;
    title: string;
    xp: number;
    stages: any;
}

interface AIRoadmap {
    courseId: string;
    title: string;
    description: string;
    icon: string;
    difficulty: string;
    lessons: AILesson[];
}

const AIGenerator: React.FC = () => {
    const [formData, setFormData] = useState<AIFormData>({
        goal: '',
        experience: 'intermediate',
        timeCommitment: '10-15',
        interests: ''
    });
    const [roadmap, setRoadmap] = useState<AIRoadmap | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/ai/generate-roadmap', formData);
            console.log('API Response:', response.data);
            console.log('Roadmap data:', response.data.roadmap);

            if (response.data.roadmap) {
                setRoadmap(response.data.roadmap);
            } else {
                console.error('No roadmap in response');
                alert('Failed to generate roadmap. Please try again.');
            }
        } catch (error) {
            console.error('Error generating roadmap:', error);
            alert('Failed to generate roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePlayRoadmap = async () => {
        if (!roadmap) return;

        setSaving(true);
        try {
            const response = await api.post('/ai/save-course', { roadmap });
            if (response.data.success) {
                // Navigate to the roadmap page
                window.location.href = `/roadmap/${response.data.courseId}`;
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-[#F5EFE1] min-h-screen font-source-serif overflow-x-hidden">
            <Navbar />

            <main className="container mx-auto px-6 py-12 pb-40 max-w-7xl relative">
                {/* Specific Mockup Heading */}
                <h1 className="text-[64px] font-bold text-[#7F6E68] text-center mt-12 mb-16 tracking-tight leading-tight">
                    Create roadmap with <span className="text-[#A06B92]">AI</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
                    {/* Left Panel: Form */}
                    <div className="bg-white rounded-[48px] p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12),0_15px_25px_-5px_rgba(0,0,0,0.06)] border border-white/50">
                        <h2 className="text-4xl font-extrabold text-[#7F6E68] mb-10">Tell us about yourself</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                            <div>
                                <label className="block text-[#7F6E68] font-bold text-xs uppercase tracking-[0.2em] mb-4 opacity-70">What's your learning goal?</label>
                                <textarea
                                    name="goal"
                                    className="w-full bg-[#F5EFE1]/40 border-2 border-[#7F6E68]/5 rounded-3xl p-6 text-[#7F6E68] font-medium placeholder-[#7F6E68]/30 outline-none focus:border-[#7F6E68]/20 transition-all min-h-[140px] resize-none shadow-inner"
                                    placeholder="E.g., Become a full-stack developer, Learn data science, Master algorithms..."
                                    value={formData.goal}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[#7F6E68] font-bold text-xs uppercase tracking-[0.2em] mb-4 opacity-70">Experience Level</label>
                                    <select
                                        name="experience"
                                        className="w-full bg-[#F5EFE1]/40 border-2 border-[#7F6E68]/5 rounded-[24px] p-5 text-[#7F6E68] font-medium outline-none focus:border-[#7F6E68]/20 transition-all shadow-inner appearance-none cursor-pointer"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%237F6E68\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.5em' }}
                                        value={formData.experience}
                                        onChange={handleChange}
                                    >
                                        <option value="beginner">Beginner - Just starting out</option>
                                        <option value="intermediate">Intermediate - Some experience</option>
                                        <option value="advanced">Advanced - Experienced developer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[#7F6E68] font-bold text-xs uppercase tracking-[0.2em] mb-4 opacity-70">Time Commitment</label>
                                    <select
                                        name="timeCommitment"
                                        className="w-full bg-[#F5EFE1]/40 border-2 border-[#7F6E68]/5 rounded-[24px] p-5 text-[#7F6E68] font-medium outline-none focus:border-[#7F6E68]/20 transition-all shadow-inner appearance-none cursor-pointer"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%237F6E68\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.5em' }}
                                        value={formData.timeCommitment}
                                        onChange={handleChange}
                                    >
                                        <option value="5-10">5-10 hours/week</option>
                                        <option value="10-15">10-15 hours/week</option>
                                        <option value="15-20">15-20 hours/week</option>
                                        <option value="20+">20+ hours/week</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[#7F6E68] font-bold text-xs uppercase tracking-[0.2em] mb-4 opacity-70">Specific Interests (Optional)</label>
                                <input
                                    type="text"
                                    name="interests"
                                    className="w-full bg-[#F5EFE1]/40 border-2 border-[#7F6E68]/5 rounded-[24px] p-5 text-[#7F6E68] font-medium placeholder-[#7F6E68]/30 outline-none focus:border-[#7F6E68]/20 transition-all shadow-inner"
                                    placeholder="E.g., React, Python, Machine Learning..."
                                    value={formData.interests}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-[#A06B92] text-[#F5EFE1] font-black py-6 px-10 rounded-3xl shadow-[0_15px_30px_-10px_rgba(127,110,104,0.5)] hover:bg-[#6D5A54] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4 text-xl mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-2xl"></span>
                                        Generate My Roadmap
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Panel: Result */}
                    <div className="flex flex-col h-full">
                        {loading && (
                            <div className="h-full bg-white rounded-[48px] p-12 shadow-2xl border border-white/50 flex flex-col items-center justify-center text-center">
                                <div className="w-32 h-32 mb-10 relative">
                                    <div className="absolute inset-0 bg-[#A8BDC9]/20 rounded-full animate-pulse scale-110"></div>
                                    <div className="relative z-10 w-full h-full bg-[#A8BDC9]/10 rounded-full flex items-center justify-center text-5xl">🔮</div>
                                </div>
                                <h3 className="text-3xl font-extrabold text-[#7F6E68] mb-4">AI is crafting your roadmap...</h3>
                                <p className="text-[#7F6E68]/60 font-bold max-w-sm leading-relaxed tracking-wide">Hang tight! We're personalizing every phase based on your experience and goals.</p>
                            </div>
                        )}

                        {roadmap && !loading && (
                            <div className="bg-white rounded-[48px] p-12 shadow-2xl border border-white/50">
                                <div className="flex gap-8 mb-12 items-start">
                                    <div className="bg-[#F5EFE1] p-5 rounded-[32px] text-4xl shadow-sm border border-[#7F6E68]/5">{roadmap.icon}</div>
                                    <div>
                                        <h2 className="text-4xl font-black text-[#7F6E68] mb-3 leading-tight tracking-tight">{roadmap.title}</h2>
                                        <p className="text-[#7F6E68]/70 font-semibold leading-relaxed text-lg">{roadmap.description}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-12">
                                    <span className="bg-[#7F6E68]/5 px-5 py-2 rounded-full text-sm font-black text-[#7F6E68] border border-[#7F6E68]/10 tracking-wide uppercase">📚 {roadmap.lessons.length} lessons</span>
                                    <span className="bg-[#A8BDC9]/15 px-5 py-2 rounded-full text-sm font-black text-[#555555] border border-[#A8BDC9]/10 tracking-wide uppercase">⚡ {roadmap.lessons.reduce((sum, l) => sum + l.xp, 0)} Total XP</span>
                                </div>

                                <div className="space-y-6">
                                    {roadmap.lessons.map((lesson, index) => (
                                        <div key={lesson.id} className="group relative bg-[#F5EFE1]/20 rounded-[40px] p-8 border border-[#7F6E68]/5 hover:bg-white hover:shadow-xl transition-all duration-400">
                                            <div className="flex gap-6 items-center mb-4">
                                                <div className="w-12 h-12 rounded-full bg-[#7F6E68] text-[#F5EFE1] flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-black text-[#7F6E68] tracking-tight">{lesson.title}</h4>
                                                    <span className="text-xs font-black text-[#7F6E68]/40 uppercase tracking-[0.2em] mt-1 inline-block">⚡ {lesson.xp} XP</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2.5">
                                                <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-[#7F6E68]/90 shadow-sm border border-[#7F6E68]/5">📖 Read</span>
                                                <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-[#7F6E68]/90 shadow-sm border border-[#7F6E68]/5">✏️ Practice</span>
                                                <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-[#7F6E68]/90 shadow-sm border border-[#7F6E68]/5">📝 Notes</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handlePlayRoadmap}
                                    disabled={saving}
                                    className="mt-12 w-full bg-[#A06B92] text-[#F5EFE1] font-black py-6 px-10 rounded-3xl shadow-[0_15px_30px_-10px_rgba(127,110,104,0.5)] hover:bg-[#6D5A54] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4 text-xl"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Saving Course...
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-2xl">🎮</span>
                                            Play This Roadmap
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {!roadmap && !loading && (
                            <div className="h-full bg-[#F5EFE1]/40 rounded-[48px] p-12 border-[6px] border-dashed border-[#7F6E68]/10 flex flex-col items-center justify-center text-center">
                                <div className="w-44 h-44 bg-white/60 rounded-full mb-10 flex items-center justify-center shadow-inner relative group overflow-hidden border border-[#7F6E68]/5">
                                    <div className="absolute inset-4 border-2 border-dashed border-[#7F6E68]/10 rounded-full group-hover:rotate-45 transition-transform duration-700 z-0"></div>
                                    <img
                                        src="/ai.png"
                                        alt="Wizard Mascot"
                                        className="w-full h-full object-contain scale-110 translate-y-2 group-hover:scale-125 group-hover:rotate-3 transition-all duration-700 relative z-10"
                                    />
                                </div>
                                <h3 className="text-4xl font-black text-[#7F6E68]/20 mb-6 tracking-tight">Your roadmap will appear here</h3>
                                <p className="text-[#7F6E68]/25 font-black max-w-[280px] uppercase text-xs tracking-[0.3em] leading-loose">Fill out the form and click "Generate My Roadmap" to get started</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AIGenerator;
