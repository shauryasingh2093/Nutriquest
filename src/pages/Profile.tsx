import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Course } from '../types';
import LoadingScreen from '../components/LoadingScreen';

interface FormData {
    name: string;
    email: string;
}

interface HeatmapDay {
    active: boolean;
    id: number;
}

const Profile: React.FC = () => {
    const { user, updateUser, updateProfile, logout } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [favoriteCourses, setFavoriteCourses] = useState<Course[]>([]);
    const [historyCourses, setHistoryCourses] = useState<Course[]>([]);
    const [loadingFavs, setLoadingFavs] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [completedCoursesCount, setCompletedCoursesCount] = useState(0);
    const [ongoingCoursesCount, setOngoingCoursesCount] = useState(0);
    const [monthOffset, setMonthOffset] = useState(0);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email
            });
            fetchAndFilterData();
        }
    }, [user]);

    const fetchAndFilterData = async () => {
        if (!user) return;
        try {
            const response = await api.get('/courses');
            const allCourses: Course[] = response.data.courses || [];

            // Process Favorites from user object (persisted in DB)
            const savedFavIds = user.favorites || [];
            const filteredFavs = allCourses.filter(course => savedFavIds.includes(course.id));
            setFavoriteCourses(filteredFavs);

            // Process History from user object (persisted in DB)
            const savedHistoryIds = user.history || [];
            const filteredHistory = savedHistoryIds
                .map(id => allCourses.find(course => course.id === id))
                .filter((course): course is Course => !!course);
            setHistoryCourses(filteredHistory);

            // Calculate statistics
            let completed = 0;
            let ongoing = 0;

            allCourses.forEach(course => {
                const lessons = course.lessons || [];
                if (lessons.length === 0) return;

                const isCompleted = lessons.every(lesson =>
                    user.completedLessons?.includes(lesson.id) ||
                    user.completedLessons?.includes(`${course.id}-${lesson.id}`)
                );

                if (isCompleted) {
                    completed++;
                } else {
                    // Check if interacted or has partial progress
                    const hasProgress = Object.keys(user.stageProgress || {}).some(key => key.startsWith(course.id));
                    const inHistory = (user.history || []).includes(course.id);
                    if (hasProgress || inHistory) {
                        ongoing++;
                    }
                }
            });

            setCompletedCoursesCount(completed);
            setOngoingCoursesCount(ongoing);

        } catch (error) {
            console.error('Error fetching course data:', error);
        } finally {
            setLoadingFavs(false);
            setLoadingHistory(false);
        }
    };

    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!user) {
            timer = setTimeout(() => setShowLoading(true), 500);
        } else {
            setShowLoading(false);
        }
        return () => clearTimeout(timer);
    }, [user]);

    if (!user) {
        if (!showLoading) return null;
        return <LoadingScreen message="Loading your profile..." />;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile({ name: formData.name });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                try {
                    await updateProfile({ avatar: base64String });
                } catch (error) {
                    console.error('Failed to update avatar:', error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Dynamic data for monthly heat map
    const generateMonthlyData = (offset: number) => {
        const streakCount = user.streak || 0;
        const today = new Date();
        const monthDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const monthName = monthDate.toLocaleString('default', { month: 'long' });
        const year = monthDate.getFullYear();
        const daysInMonth = new Date(year, monthDate.getMonth() + 1, 0).getDate();

        // Calculate offset for the first day of the month (0 = Monday, 6 = Sunday)
        let firstDay = monthDate.getDay(); // 0 is Sunday
        const firstDayOffset = firstDay === 0 ? 6 : firstDay - 1;

        const days = [];
        // Padding for the start of the month
        for (let p = 0; p < firstDayOffset; p++) {
            days.push({ id: `pad-${offset}-${p}`, type: 'padding' });
        }

        // Actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const dayDate = new Date(year, monthDate.getMonth(), d);
            dayDate.setHours(0, 0, 0, 0); // Normalize to start of day

            const todayNormalized = new Date(today);
            todayNormalized.setHours(0, 0, 0, 0); // Normalize to start of day

            const isToday = dayDate.getTime() === todayNormalized.getTime();
            const diffTime = todayNormalized.getTime() - dayDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            days.push({
                id: `day-${year}-${monthDate.getMonth()}-${d}`,
                type: 'day',
                active: diffDays >= 0 && diffDays < streakCount,
                isToday
            });
        }

        return { name: `${monthName} ${year}`, days };
    };

    const currentMonthData = generateMonthlyData(monthOffset);

    return (
        <div className="bg-[#F5EFE1] min-h-screen font-source-serif">
            <Navbar />

            {/* Banner Section */}
            <div className="w-full h-80 relative bg-[#F5EFE1]">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#F5EFE1]/20 to-transparent"></div>
                <img
                    src="/bg.png"
                    alt="Banner"
                    className="w-full h-full object-cover"
                />

                {/* Overlapping Profile Picture */}
                <div className="absolute -bottom-20 left-16 z-20">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full border-8 border-[#F5EFE1] overflow-hidden shadow-2xl bg-white ring-2 ring-black/5">
                            <img
                                src={user.avatar || "/progress.png"}
                                alt="Profile Large"
                                className="w-full h-full object-cover"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Squirrel'; }}
                            />
                        </div>
                        <div className="absolute -right-16 top-1/2 -translate-y-1/2 bg-[#5DAD54] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border-2 border-[#F5EFE1] whitespace-nowrap z-40">
                            ACTIVE LEARNER
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 bg-[#333333] p-2.5 rounded-full shadow-lg hover:scale-110 transition-all border border-white/20 active:scale-95 cursor-pointer z-30"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="container mx-auto px-8 py-24 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1.2fr] gap-12">

                    {/* Left Column: Edit Profile */}
                    <div className="space-y-6 pt-11">
                        <div className="bg-[#EFE7D6] rounded-[32px] p-10 h-full border border-black/5 shadow-sm">
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-black text-[#333333] mb-4">Edit Profile</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-[#333333]/50 uppercase tracking-widest mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#F5EFE1] border-none rounded-xl px-4 py-3 font-bold text-[#333333] focus:ring-2 focus:ring-[#333333]/10"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-[#333333]/50 uppercase tracking-widest mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#F5EFE1] border-none rounded-xl px-4 py-3 font-bold text-[#333333] focus:ring-2 focus:ring-[#333333]/10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-[#333333] text-white py-3 rounded-2xl font-bold hover:bg-[#444444] transition-colors shadow-lg active:scale-95"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 bg-[#333333]/10 text-[#333333] py-3 rounded-2xl font-bold hover:bg-[#333333]/20 transition-colors active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <h1 className="text-4xl font-black text-[#333333] mb-1 leading-tight">{user.name}</h1>
                                        <p className="text-[#333333]/60 font-medium tracking-wide uppercase text-xs">NutriQuest Explorer</p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-black/5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#333333]/50">Email</span>
                                            <span className="font-bold text-[#333333] truncate ml-4">{user.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#333333]/50">Joined</span>
                                            <span className="font-bold text-[#333333]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#333333]/50">Path</span>
                                            <span className="font-bold text-[#333333]">Fundamentals</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setFormData({ name: user.name, email: user.email });
                                            setIsEditing(true);
                                        }}
                                        className="w-full mt-12 bg-[#333333] text-white py-3 rounded-2xl font-bold hover:bg-[#444444] transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Center Column: Stats & Heatmap */}
                    <div className="space-y-8">
                        {/* Statistics Grid */}
                        <div className="bg-[#D9D1C0] rounded-[24px] mt-11 p-8 border border-black/5 shadow-sm">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-[#333333] mb-1">Your Learning Story</h3>
                                <p className="text-sm text-[#333333]/60">Documenting your growth and consistency</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                {/* Streak Card */}
                                <div className="bg-[#EFE7D6]/80 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 border border-white/40 shadow-sm group hover:scale-[1.02] transition-transform cursor-default">
                                    <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center shadow-inner">
                                        <img src="/fire flame.png" alt="Streak" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#333333]/40 uppercase tracking-widest">Unstoppable</p>
                                        <p className="font-bold text-[#333333] text-base">{user.streak} Day Momentum</p>
                                    </div>
                                </div>
                                {/* XP Card */}
                                <div className="bg-[#EFE7D6]/80 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 border border-white/40 shadow-sm group hover:scale-[1.02] transition-transform cursor-default">
                                    <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center shadow-inner">
                                        <img src="/star.png" alt="XP" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#333333]/40 uppercase tracking-widest">Growth</p>
                                        <p className="font-bold text-[#333333] text-base">{user.xp} XP Earned</p>
                                    </div>
                                </div>
                                {/* Badges Card */}
                                <div className="bg-[#EFE7D6]/80 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 border border-white/40 shadow-sm group hover:scale-[1.02] transition-transform cursor-default">
                                    <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center shadow-inner">
                                        <img src="/Reward ribbons.png" alt="Badges" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#333333]/40 uppercase tracking-widest">Milestones</p>
                                        <p className="font-bold text-[#333333] text-base">{(user.achievements || []).length} Badges Unlocked</p>
                                    </div>
                                </div>
                                {/* Completed Card */}
                                <div className="bg-[#EFE7D6]/80 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 border border-white/40 shadow-sm group hover:scale-[1.02] transition-transform cursor-default">
                                    <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center shadow-inner">
                                        <img src="/courses_done.png" alt="Completed" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#333333]/40 uppercase tracking-widest">Mastery</p>
                                        <p className="font-bold text-[#333333] text-base">{completedCoursesCount} Course{completedCoursesCount !== 1 ? 's' : ''} Done</p>
                                    </div>
                                </div>
                                {/* Ongoing Card */}
                                <div className="bg-[#EFE7D6]/80 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 border border-white/40 shadow-sm group hover:scale-[1.02] transition-transform cursor-default">
                                    <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center shadow-inner">
                                        <img src="/progress.png" alt="Ongoing" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#333333]/40 uppercase tracking-widest">In Motion</p>
                                        <p className="font-bold text-[#333333] text-base">{ongoingCoursesCount} Active Path{ongoingCoursesCount !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Heatmap Grid */}
                        {/* Heatmap Grid */}
                        <div className="bg-[#EFE7D6] rounded-[24px] p-10 border border-black/5 shadow-sm flex flex-col items-center">
                            <div className="w-fit min-w-[300px]">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3 mb-1">
                                            <button
                                                onClick={() => setMonthOffset(prev => prev - 1)}
                                                className="p-1 hover:bg-black/5 rounded-full transition-colors active:scale-90"
                                            >
                                                <svg className="w-4 h-4 text-[#333333]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                            <h3 className="text-xl font-black text-[#333333] min-w-[140px] text-center">{currentMonthData.name}</h3>
                                            <button
                                                onClick={() => setMonthOffset(prev => prev + 1)}
                                                className="p-1 hover:bg-black/5 rounded-full transition-colors active:scale-90"
                                            >
                                                <svg className="w-4 h-4 text-[#333333]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-[#333333]/40 font-bold uppercase tracking-widest text-center">Learning Consistency</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-8">
                                        <span className="text-[10px] text-[#333333]/40 font-bold uppercase tracking-wider">Less</span>
                                        <div className="flex gap-1">
                                            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#D1D5DB]"></div>
                                            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#5DAD54]/40"></div>
                                            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#5DAD54]/70"></div>
                                            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#5DAD54]"></div>
                                        </div>
                                        <span className="text-[10px] text-[#333333]/40 font-bold uppercase tracking-wider">More</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                                    {/* Day Headers */}
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                        <div key={`${d}-${i}`} className="text-[9px] font-bold text-[#333333]/20 flex items-center justify-center mb-1">{d}</div>
                                    ))}
                                    {/* Month Days */}
                                    {currentMonthData.days.map((day: any) => (
                                        <div
                                            key={day.id}
                                            className={`w-4 h-4 md:w-5 md:h-5 rounded-[2px] transition-colors border border-black/5 ${day.type === 'padding' ? 'opacity-0' :
                                                day.active ? 'bg-[#5DAD54]' : 'bg-[#D1D5DB]'
                                                } ${day.isToday ? 'ring-1 ring-[#5DAD54] ring-offset-1' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Liked & Recents */}
                    <div className="space-y-8">
                        {/* Liked Section */}
                        <div className="bg-[#9B8B7E]/90 rounded-[24px] p-8 mt-11 shadow-md border border-white/10 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-xl">❤️</span>
                                <h3 className="text-xl font-bold text-white tracking-widest uppercase opacity-90">Bookmarked</h3>
                            </div>
                            <div className="space-y-3">
                                {loadingFavs ? (
                                    <div className="text-white/60 text-sm animate-pulse">Loading bookmarks...</div>
                                ) : favoriteCourses.length > 0 ? (
                                    favoriteCourses.map(course => (
                                        <Link
                                            key={course.id}
                                            to={`/roadmap/${course.id}`}
                                            className="bg-white/80 hover:bg-white transition-all rounded-2xl p-4 flex items-center justify-between group shadow-sm border border-white/20"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-red-500 font-bold scale-90">❤️</span>
                                                <span className="text-lg font-bold text-[#333333] line-clamp-1">{course.title}</span>
                                            </div>
                                            <svg className="w-5 h-5 text-[#333333]/40 group-hover:text-[#333333] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="bg-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-white/10 border-dashed">
                                        <p className="text-white/60 text-sm italic">Your liked courses will appear here</p>
                                        <Link to="/courses" className="mt-2 text-white/90 font-bold text-xs underline decoration-white/30">Browse Courses</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recents Section */}
                        <div className="bg-[#9B8B7E]/80 rounded-[24px] p-8 shadow-md border border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-white text-xl opacity-80">🕒</span>
                                <h3 className="text-xl font-bold text-white tracking-widest uppercase opacity-80">History</h3>
                            </div>
                            <div className="space-y-3">
                                {loadingHistory ? (
                                    <div className="text-white/60 text-sm animate-pulse">Loading history...</div>
                                ) : historyCourses.length > 0 ? (
                                    historyCourses.map(course => (
                                        <Link
                                            key={course.id}
                                            to={`/roadmap/${course.id}`}
                                            className="bg-white/70 hover:bg-white transition-all rounded-2xl p-4 flex items-center justify-between border border-white/10 group shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-base opacity-40 group-hover:opacity-100 transition-opacity">🕒</span>
                                                <span className="text-lg font-bold text-[#333333]/80 group-hover:text-[#333333] transition-colors line-clamp-1">{course.title}</span>
                                            </div>
                                            <svg className="w-5 h-5 text-[#333333]/20 group-hover:text-[#333333] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="bg-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-white/5 border-dashed">
                                        <p className="text-white/40 text-sm italic">Recently visited courses will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Mascot & Actions */}
                <div className="flex justify-end items-end mt-12 gap-8 relative">
                    <img
                        src="/progress.png"
                        alt="Mascot"
                        className="w-24 h-auto drop-shadow-lg"
                    />
                    <div className="bg-[#9B8B7E] rounded-2xl p-2 flex gap-4 shadow-lg border border-white/20">
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors group relative"
                            title="Logout"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
