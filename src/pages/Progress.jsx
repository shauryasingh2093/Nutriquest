import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';

export default function Progress() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ongoing');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateNotes, setDateNotes] = useState({
        // Format: 'YYYY-MM-DD': ['note1', 'note2', ...]
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            const coursesData = response.data.courses || response.data;

            // Calculate progress for each course based on user's completed lessons
            const coursesWithProgress = coursesData.map(course => {
                const totalLessons = course.lessons.length;
                const completedLessons = course.lessons.filter(lesson => {
                    // Check for both exact match and prefixed match (e.g., "arrays" or "dsa-arrays")
                    const prefixedId = `${course.id}-${lesson.id}`;
                    return user.completedLessons.includes(lesson.id) ||
                        user.completedLessons.includes(prefixedId);
                }).length;

                const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                const status = progress === 100 ? 'completed' : progress > 0 ? 'ongoing' : 'not-started';

                // Calculate XP earned from this course
                const xpEarned = completedLessons * 10; // Assuming 10 XP per lesson

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

            console.log('Courses with progress:', coursesWithProgress);
            console.log('User completed lessons:', user.completedLessons);

            setCourses(coursesWithProgress);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    };

    // Generate calendar for current month
    const generateCalendar = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Adjust for Monday start (0 = Monday, 6 = Sunday)
        const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

        // Add empty cells for days before the month starts
        for (let i = 0; i < adjustedStart; i++) {
            days.push({ date: null, isActive: false });
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isActive = day <= today.getDate() && Math.random() > 0.4;
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasNotes = dateNotes[dateKey] && dateNotes[dateKey].length > 0;
            days.push({ date: day, isActive, dateKey, hasNotes });
        }

        return {
            month: today.toLocaleString('default', { month: 'long' }),
            year: year,
            days: days
        };
    };

    const calendar = generateCalendar();

    const filteredCourses = courses.filter(course => {
        // For ongoing filter, only show courses with progress > 0
        const matchesFilter = activeFilter === 'all' ||
            course.status === activeFilter ||
            (activeFilter === 'ongoing' && course.progress > 0 && course.status !== 'completed');
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Handle calendar date click
    const handleDateClick = (day) => {
        if (day.date) {
            setSelectedDate(day.dateKey);
        }
    };

    // Add a note for the selected date
    const addNote = (noteText) => {
        if (selectedDate && noteText.trim()) {
            setDateNotes(prev => ({
                ...prev,
                [selectedDate]: [...(prev[selectedDate] || []), noteText.trim()]
            }));
        }
    };

    // Delete a note
    const deleteNote = (dateKey, noteIndex) => {
        setDateNotes(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].filter((_, index) => index !== noteIndex)
        }));
    };

    // Get notes for selected date
    const selectedDateNotes = selectedDate ? (dateNotes[selectedDate] || []) : [];
    const selectedDateFormatted = selectedDate ? new Date(selectedDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

    return (
        <div className="bg-[#F5EFE1] min-h-screen font-source-serif">
            <Navbar />

            <main className="container mx-auto px-8 py-8 max-w-7xl pb-40 relative">
                {/* Search Bar */}
                <div className="mb-6 mt-8">
                    <div className="bg-white rounded-[28px] px-8 py-4 shadow-md border border-[#7F6E68]/5 flex items-center gap-4">
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
                                    <h2 className="text-xl font-black text-white mb-2 tracking-tight leading-tight">{course.title}</h2>
                                    <p className="text-white text-[11px] leading-snug mb-4 font-medium line-clamp-2 brightness-110">
                                        {course.description}
                                    </p>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-white/10 mb-4"></div>

                                    {/* Progress Bar */}
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-black text-[11px]">{course.progress}% Completed</span>
                                            <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full border border-white/10">
                                                <span className="text-xs">⭐</span>
                                                <span className="text-white font-black text-[10px]">+{course.xpEarned} XP</span>
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
                                        className="w-full bg-[#A06B92] hover:bg-[#8F5A81] text-white font-black py-2 px-4 rounded-[16px] text-xs transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md flex items-center justify-center gap-1.5"
                                    >
                                        Continue Learning
                                        <span className="text-sm">→</span>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right: Unified Calendar & Notes Widget */}
                    <div className="w-85 flex-shrink-0">
                        <div className="bg-gradient-to-br from-[#A8BDC9] to-[#9BADB9] rounded-[16px] p-3 shadow-lg sticky top-4">
                            {!selectedDate ? (
                                /* Calendar View */
                                <>
                                    <div className="flex items-center justify-between mb-2">
                                        <button className="w-4 h-4 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors">
                                            <span className="text-white text-[8px] font-bold">←</span>
                                        </button>
                                        <h3 className="text-white font-black text-[10px] drop-shadow-md">{calendar.month} {calendar.year}</h3>
                                        <button className="w-4 h-4 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors">
                                            <span className="text-white text-[8px] font-bold">→</span>
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-0.5 mb-2">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                            <div key={i} className="text-center text-white/80 font-bold text-[8px]">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-0.5">
                                        {calendar.days.map((day, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleDateClick(day)}
                                                className={`aspect-square rounded-md flex items-center justify-center text-[11px] font-black transition-all relative ${day.date === null
                                                    ? 'bg-transparent pointer-events-none'
                                                    : day.isActive
                                                        ? 'bg-white text-[#2D241F] shadow-md cursor-pointer hover:scale-110 hover:shadow-lg ring-2 ring-white/20'
                                                        : 'bg-white/30 text-[#2D241F]/80 cursor-pointer hover:bg-white/50 hover:scale-105'
                                                    }`}
                                            >
                                                {day.date}
                                                {day.hasNotes && (
                                                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-sm border border-white/20"></span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[#4A3C36] text-[12px] text-center mt-6 font-bold italic opacity-80">Click a date to view notes</p>
                                </>
                            ) : (
                                /* Notes View */
                                <div className="animate-fadeIn">
                                    <div className="flex items-center justify-between mb-3">
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors"
                                        >
                                            <span className="text-sm">←</span>
                                            <span className="text-xs font-bold">Back</span>
                                        </button>
                                        <h3 className="text-white font-black text-xs drop-shadow-md">
                                            {selectedDateFormatted}
                                        </h3>
                                        <div className="w-12"></div> {/* Spacer for alignment */}
                                    </div>

                                    {/* Notes List */}
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-3">
                                        <ul className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
                                            {selectedDateNotes.length > 0 ? (
                                                selectedDateNotes.map((note, index) => (
                                                    <li key={index} className="flex items-start gap-1.5 group bg-white/40 rounded-lg px-2.5 py-2 hover:bg-white/60 transition-colors border border-white/10">
                                                        <span className="text-[#2D241F] font-black text-[10px] mt-0.5">•</span>
                                                        <span className="text-[#2D241F] font-black text-[10px] flex-1 leading-tight">{note}</span>
                                                        <button
                                                            onClick={() => deleteNote(selectedDate, index)}
                                                            className="opacity-0 group-hover:opacity-100 text-red-700 hover:text-red-900 text-sm font-black transition-opacity px-1"
                                                        >
                                                            ×
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-white font-bold text-[10px] italic text-center py-3 drop-shadow-sm">No notes yet</li>
                                            )}
                                        </ul>
                                        <input
                                            type="text"
                                            placeholder="Type a note and press Enter..."
                                            className="w-full bg-white/80 border border-white/40 rounded-lg px-2.5 py-1.5 text-[9px] text-[#333333] placeholder-[#333333]/50 focus:outline-none focus:ring-2 focus:ring-white/60 focus:bg-white"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    addNote(e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative Mascot from progress.png */}
                <div className="flex justify-end mt-3 mb-8 right-20">
                    <img src="/progress.png" alt="Progress Mascot" className="w-[280px] h-auto drop-shadow-2xl" />
                </div>
            </main >
        </div >
    );
}
