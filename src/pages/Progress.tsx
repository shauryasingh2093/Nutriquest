import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Course } from '../types';

interface CourseProgress {
    id: string;
    title: string;
    description: string;
    progress: number;
    xpEarned: number;
    status: string;
    totalLessons: number;
    completedLessons: number;
}

interface Day {
    date: number | null;
    isActive: boolean;
    dateKey?: string;
    hasNotes?: boolean;
}

const Progress: React.FC = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ongoing');

    const [courses, setCourses] = useState<CourseProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [dateNotes, setDateNotes] = useState<Record<string, string[]>>({});
    const [viewDate, setViewDate] = useState(new Date());

    useEffect(() => {
        if (user) {
            fetchCourses();
        }
    }, [user]);

    const fetchCourses = async () => {
        if (!user) return;
        try {
            const response = await api.get('/courses');
            const coursesData: Course[] = response.data.courses || response.data;

            const coursesWithProgress: CourseProgress[] = coursesData.map(course => {
                const totalLessons = course.lessons.length;
                const completedLessons = course.lessons.filter(lesson => {
                    const prefixedId = `${course.id}-${lesson.id}`;
                    return user.completedLessons.includes(lesson.id) ||
                        user.completedLessons.includes(prefixedId);
                }).length;

                const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                const status = progress === 100 ? 'completed' : progress > 0 ? 'ongoing' : 'not-started';
                const xpEarned = completedLessons * 10;

                return {
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    progress: progress,
                    xpEarned: xpEarned,
                    status: status,
                    totalLessons: totalLessons,
                    completedLessons: completedLessons
                };
            });

            setCourses(coursesWithProgress);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    };

    const generateCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const today = new Date();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: Day[] = [];
        const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

        for (let i = 0; i < adjustedStart; i++) {
            days.push({ date: null, isActive: false });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasNotes = dateNotes[dateKey] && dateNotes[dateKey].length > 0;
            days.push({ date: day, isActive: isToday, dateKey, hasNotes });
        }

        return {
            month: viewDate.toLocaleString('default', { month: 'long' }),
            year: year,
            days: days
        };
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const calendar = generateCalendar();

    const filteredCourses = courses.filter(course => {
        const matchesFilter = activeFilter === 'all' ||
            course.status === activeFilter ||
            (activeFilter === 'ongoing' && course.progress > 0 && course.status !== 'completed');
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleDateClick = (day: Day) => {
        if (day.date && day.dateKey) {
            setSelectedDate(day.dateKey);
        }
    };

    const addNote = (noteText: string) => {
        if (selectedDate && noteText.trim()) {
            setDateNotes(prev => ({
                ...prev,
                [selectedDate]: [...(prev[selectedDate] || []), noteText.trim()]
            }));
        }
    };

    const deleteNote = (dateKey: string, noteIndex: number) => {
        setDateNotes(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].filter((_, index) => index !== noteIndex)
        }));
    };

    const selectedDateNotes = selectedDate ? (dateNotes[selectedDate] || []) : [];
    const selectedDateFormatted = selectedDate ? new Date(selectedDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

    if (!user) {
        return (
            <div className="bg-[#F5EFE1] min-h-screen font-source-serif">
                <Navbar />
                <div className="flex items-center justify-center p-20">
                    <p className="text-[#7F6E68] font-bold">Please log in to see your progress.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F5EFE1] min-h-screen font-source-serif">
            <Navbar />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>

            <main className="container mx-auto px-8 py-8 max-w-7xl pb-40 relative">
                {/* Search Bar */}
                <div className="mb-6 mt-8">
                    <div className="bg-white rounded-[24px] px-8 py-4 shadow-md border border-[#7F6E68]/10 flex items-center gap-4 transition-all focus-within:ring-2 focus-within:ring-[#7F6E68]/10">
                        <svg className="w-5 h-5 text-[#7F6E68]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-[#4A3C36] text-base font-bold placeholder-[#7F6E68]/50"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => setActiveFilter('completed')}
                        className={`px-5 py-2 rounded-full font-black text-sm transition-all ${activeFilter === 'completed'
                            ? 'bg-[#C9B5A0] text-[#2D241F] shadow-md border-2 border-[#7F6E68]/30'
                            : 'bg-transparent text-[#7F6E68] border-2 border-[#7F6E68]/40 hover:border-[#7F6E68]/60 hover:text-[#4A3C36]'
                            }`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setActiveFilter('ongoing')}
                        className={`px-5 py-2 rounded-full font-black text-sm transition-all ${activeFilter === 'ongoing'
                            ? 'bg-[#333333] text-white shadow-md'
                            : 'bg-transparent text-[#7F6E68] border-2 border-[#7F6E68]/40 hover:border-[#7F6E68]/60 hover:text-[#4A3C36]'
                            }`}
                    >
                        Ongoing
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex gap-6 items-start">
                    {/* Left Column: Course Cards */}
                    <div className="flex-1 space-y-6">
                        {loading ? (
                            <div className="bg-white rounded-[40px] p-20 text-center">
                                <div className="w-16 h-16 border-4 border-[#7F6E68]/20 border-t-[#7F6E68] rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-[#7F6E68] font-bold">Loading your progress...</p>
                            </div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="bg-white rounded-[40px] p-20 text-center">
                                <p className="text-[#7F6E68]/60 font-bold text-lg">No courses found</p>
                                <p className="text-[#7F6E68]/40 text-sm mt-2">Try adjusting your filters or search query</p>
                            </div>
                        ) : (
                            filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-[#9B8B7E] rounded-[20px] p-4 shadow-[0_8px_20px_-5px_rgba(0,0,0,0.2)] relative"
                                >
                                    <h2 className="text-lg font-black text-white mb-2 tracking-tight leading-tight font-sans">{course.title}</h2>
                                    <p className="text-white/80 text-[11px] leading-snug mb-5 font-bold font-sans line-clamp-2 brightness-110">
                                        {course.description}
                                    </p>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-white/10 mb-4"></div>

                                    {/* Progress Bar */}
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-black text-[10px] uppercase tracking-wider opacity-90 font-sans">{course.progress}% Completed</span>
                                            <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                                                <span className="text-[10px]">⭐</span>
                                                <span className="text-white font-black text-[9px] font-sans">+{course.xpEarned} XP</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-white/25 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Continue Button */}
                                    <Link
                                        to={`/roadmap/${course.id}`}
                                        className="w-full bg-[#A06B92] hover:bg-[#8F5A81] text-white font-black py-2.5 px-4 rounded-[16px] text-[11px] font-sans transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md flex items-center justify-center gap-2 group/btn"
                                    >
                                        <span className="uppercase tracking-widest leading-none">Continue Learning</span>
                                        <span className="text-[14px] group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right: Unified Calendar & Notes Widget */}
                    <div className="w-86 flex-shrink-0">
                        <div className="bg-gradient-to-br from-[#A8BDC9] to-[#9BADB9] rounded-[24px] p-4 shadow-lg sticky top-12 relative min-h-[420px] flex flex-col">
                            {/* Decorative Mascot */}
                            <div className="absolute -top-23 right-1">
                                <img src="/progress.png" alt="Progress Mascot" className="w-[80px] h-auto drop-shadow-xl" />
                            </div>

                            {!selectedDate ? (
                                /* Calendar View */
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            onClick={handlePrevMonth}
                                            className="w-5 h-5 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors shadow-sm"
                                        >
                                            <span className="text-white text-xs font-bold font-sans">←</span>
                                        </button>
                                        <h3 className="text-white font-black text-sm uppercase tracking-wider drop-shadow-md">{calendar.month} {calendar.year}</h3>
                                        <button
                                            onClick={handleNextMonth}
                                            className="w-5 h-5 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors shadow-sm"
                                        >
                                            <span className="text-white text-xs font-bold font-sans">→</span>
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-1 mb-3">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                            <div key={i} className="text-center text-white/90 font-black text-[10px] uppercase">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1.5 flex-1">
                                        {calendar.days.map((day, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleDateClick(day)}
                                                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all relative ${day.date === null
                                                    ? 'bg-transparent pointer-events-none'
                                                    : day.isActive
                                                        ? 'bg-white text-[#2D241F] shadow-md cursor-pointer hover:scale-110 hover:shadow-lg ring-2 ring-white/20'
                                                        : 'bg-white/30 text-[#2D241F]/80 cursor-pointer hover:bg-white/50 hover:scale-105'
                                                    }`}
                                            >
                                                {day.date}
                                                {day.hasNotes && (
                                                    <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full shadow-sm border border-white/40 animate-pulse"></span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-white/80 text-[11px] text-center mt-6 font-bold tracking-tight bg-white/10 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                                        Click a date to track your journey
                                    </p>
                                </div>
                            ) : (
                                /* Notes View */
                                <div className="animate-fadeIn flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-5 px-1">
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors group"
                                        >
                                            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                                            <span className="text-sm font-black uppercase tracking-wider">Back</span>
                                        </button>
                                        <h3 className="text-white font-black text-sm drop-shadow-md">
                                            {selectedDateFormatted}
                                        </h3>
                                        <div className="w-12"></div>
                                    </div>

                                    {/* Notes List */}
                                    <div className="bg-white/20 backdrop-blur-md rounded-[20px] p-4 mb-4 flex-1 flex flex-col border border-white/10 shadow-inner">
                                        <ul className="space-y-2 mb-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                            {selectedDateNotes.length > 0 ? (
                                                selectedDateNotes.map((note, index) => (
                                                    <li key={index} className="flex items-start gap-3 group bg-white border border-white/20 rounded-xl px-4 py-3 hover:translate-y-[-1px] transition-all shadow-sm">
                                                        <span className="text-[#2D241F]/30 font-black text-xs mt-1">•</span>
                                                        <span className="text-[#2D241F] font-bold text-[13px] flex-1 leading-relaxed">{note}</span>
                                                        <button
                                                            onClick={() => deleteNote(selectedDate!, index)}
                                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xl font-black transition-opacity px-1"
                                                            title="Delete note"
                                                        >
                                                            ×
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-60">
                                                    <span className="text-3xl mb-3">📝</span>
                                                    <p className="text-white font-black text-sm tracking-wide">No notes yet</p>
                                                    <p className="text-white/80 font-medium text-[11px] mt-1 italic">Record your daily wins!</p>
                                                </div>
                                            )}
                                        </ul>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="Add a new note..."
                                                className="w-full bg-white border-2 border-transparent rounded-2xl px-5 py-4 text-sm text-[#2D241F] font-bold placeholder-[#2D241F]/30 focus:outline-none focus:border-white/50 focus:ring-4 focus:ring-white/10 transition-all shadow-lg"
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                        addNote(e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#2D241F]/20 group-focus-within:opacity-0 transition-opacity uppercase tracking-tighter">
                                                Enter ↵
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Progress;
