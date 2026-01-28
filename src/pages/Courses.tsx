import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Course } from '../types';

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState<(string | number)[]>(() => {
        const saved = localStorage.getItem('nutriquest_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('nutriquest_favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            const fetchedCourses: Course[] = response.data.courses || [];

            // Filter unique courses by ID
            const uniqueCourses = fetchedCourses.filter((course, index, self) =>
                index === self.findIndex((c) => c.id === course.id)
            );

            setCourses(uniqueCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (e: React.MouseEvent, courseId: string | number) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const courseColors: Record<string, string> = {
        'HTML': 'bg-[#A8BDC9]',
        'CSS': 'bg-[#A58E84]',
        'JavaScript': 'bg-[#8E8B82]',
        'React': 'bg-[#DEC9B7]',
        'Introduction to HTML': 'bg-[#A8BDC9]',
    };

    const courseIcons: Record<string, JSX.Element> = {
        'HTML': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 15l8 65 22 10 22-10 8-75h-60z" fill="#7F6E68" opacity="0.15" />
                    <text x="50" y="62" textAnchor="middle" fontSize="32" fontWeight="900" fill="#7F6E68" className="font-mono">{'</>'}</text>
                    <text x="50" y="80" textAnchor="middle" fontSize="12" fontWeight="900" fill="#7F6E68" letterSpacing="1">HTML</text>
                </svg>
            </div>
        ),
        'CSS': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 15l8 65 22 10 22-10 8-75h-60z" fill="#7F6E68" opacity="0.15" />
                    <text x="50" y="65" textAnchor="middle" fontSize="42" fontWeight="900" fill="#7F6E68" className="font-mono">{'3'}</text>
                    <text x="50" y="85" textAnchor="middle" fontSize="12" fontWeight="900" fill="#7F6E68" letterSpacing="1">CSS</text>
                </svg>
            </div>
        ),
        'JavaScript': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-18 h-18 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <rect x="25" y="25" width="50" height="50" rx="4" fill="#7F6E68" opacity="0.15" />
                    <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="900" fill="#7F6E68">JS</text>
                    <text x="50" y="75" textAnchor="middle" fontSize="12" fontWeight="900" fill="#7F6E68" letterSpacing="1">SCRIPT</text>
                </svg>
            </div>
        ),
        'Python Programming': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 20c-15 0-14 13-14 13h15v4h-21s-13-2-13 15 11 15 11 15h6v-8c0-10 8-10 8-10h12s10 0 10-10-10-14-14-14z" fill="#7F6E68" opacity="0.2" />
                    <text x="50" y="58" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7F6E68">Py</text>
                </svg>
            </div>
        ),
        'React': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 animate-[spin_10s_linear_infinite]" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="4" fill="#7F6E68" opacity="0.3" />
                    <ellipse cx="50" cy="50" rx="30" ry="10" stroke="#7F6E68" strokeWidth="3" fill="none" opacity="0.2" />
                    <ellipse cx="50" cy="50" rx="30" ry="10" stroke="#7F6E68" strokeWidth="3" fill="none" opacity="0.2" transform="rotate(60 50 50)" />
                    <ellipse cx="50" cy="50" rx="30" ry="10" stroke="#7F6E68" strokeWidth="3" fill="none" opacity="0.2" transform="rotate(120 50 50)" />
                </svg>
            </div>
        ),
        'Data Structures & Algorithms': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="30" r="10" fill="#7F6E68" opacity="0.15" />
                    <circle cx="30" cy="65" r="10" fill="#7F6E68" opacity="0.15" />
                    <circle cx="70" cy="65" r="10" fill="#7F6E68" opacity="0.15" />
                    <path d="M50 40 L30 55 M50 40 L70 55" stroke="#7F6E68" strokeWidth="3" opacity="0.2" />
                    <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="900" fill="#7F6E68">DSA</text>
                </svg>
            </div>
        ),
        'Web Development': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="30" width="60" height="40" rx="4" fill="#7F6E68" opacity="0.15" />
                    <line x1="20" y1="40" x2="80" y2="40" stroke="#7F6E68" strokeWidth="2" opacity="0.2" />
                    <text x="50" y="58" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7F6E68">WEB</text>
                </svg>
            </div>
        ),
        'Database Systems': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 30 C30 20, 70 20, 70 30 L70 70 C70 80, 30 80, 30 70 Z" fill="#7F6E68" opacity="0.15" />
                    <ellipse cx="50" cy="30" rx="20" ry="8" stroke="#7F6E68" strokeWidth="2" fill="none" opacity="0.2" />
                    <text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="900" fill="#7F6E68">SQL</text>
                </svg>
            </div>
        ),
        'System Design': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <rect x="40" y="20" width="20" height="20" fill="#7F6E68" opacity="0.15" />
                    <rect x="20" y="60" width="20" height="20" fill="#7F6E68" opacity="0.15" />
                    <rect x="60" y="60" width="20" height="20" fill="#7F6E68" opacity="0.15" />
                    <path d="M50 40 L30 60 M50 40 L70 60" stroke="#7F6E68" strokeWidth="2" opacity="0.2" />
                    <text x="50" y="58" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7F6E68">SYS</text>
                </svg>
            </div>
        ),
        'Machine Learning': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="35" cy="35" r="8" fill="#7F6E68" opacity="0.15" />
                    <circle cx="65" cy="35" r="8" fill="#7F6E68" opacity="0.15" />
                    <circle cx="50" cy="65" r="8" fill="#7F6E68" opacity="0.15" />
                    <path d="M35 35 L50 65 L65 35 Z" fill="none" stroke="#7F6E68" strokeWidth="2" opacity="0.2" />
                    <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="900" fill="#7F6E68">ML</text>
                </svg>
            </div>
        ),
        'Figma': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 30 C30 20, 50 20, 50 30 C50 40, 30 40, 30 30" fill="#7F6E68" opacity="0.15" />
                    <path d="M50 30 C50 20, 70 20, 70 30 C70 40, 50 40, 50 30" fill="#7F6E68" opacity="0.1" />
                    <path d="M30 50 C30 40, 50 40, 50 50 C50 60, 30 60, 30 50" fill="#7F6E68" opacity="0.15" />
                    <path d="M50 50 C50 40, 70 40, 70 50 C70 60, 50 60, 50 50" fill="#7F6E68" opacity="0.1" />
                    <path d="M30 70 C30 60, 50 60, 50 70 C50 80, 30 80, 30 70" fill="#7F6E68" opacity="0.15" />
                </svg>
            </div>
        ),
        'TypeScript': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-18 h-18 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <rect x="25" y="25" width="50" height="50" rx="4" fill="#7F6E68" opacity="0.15" />
                    <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="900" fill="#7F6E68">TS</text>
                    <text x="50" y="75" textAnchor="middle" fontSize="10" fontWeight="900" fill="#7F6E68" letterSpacing="1">STRICT</text>
                </svg>
            </div>
        ),
        'Default': (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-white/40 rounded-full shadow-inner border border-white/30 blur-[1px]"></div>
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 20 L80 40 L80 70 L50 90 L20 70 L20 40 Z" fill="#7F6E68" opacity="0.15" />
                    <text x="50" y="62" textAnchor="middle" fontSize="32" fontWeight="900" fill="#7F6E68" className="font-mono">{'?'}</text>
                </svg>
            </div>
        ),
    };

    const getCourseIcon = (title: string) => {
        if (courseIcons[title]) return courseIcons[title];

        // Keyword based matching
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('figma') || lowerTitle.includes('ui/ux') || lowerTitle.includes('design')) return courseIcons['Figma'];
        if (lowerTitle.includes('react')) return courseIcons['React'];
        if (lowerTitle.includes('data science') || lowerTitle.includes('machine learning')) return courseIcons['Machine Learning'];
        if (lowerTitle.includes('typescript') || lowerTitle.includes('ts ') || lowerTitle.endsWith('ts')) return courseIcons['TypeScript'];
        if (lowerTitle.includes('javascript') || lowerTitle.includes('js')) return courseIcons['JavaScript'];
        if (lowerTitle.includes('html')) return courseIcons['HTML'];
        if (lowerTitle.includes('css')) return courseIcons['CSS'];
        if (lowerTitle.includes('python')) return courseIcons['Python Programming'];
        if (lowerTitle.includes('database') || lowerTitle.includes('sql')) return courseIcons['Database Systems'];
        if (lowerTitle.includes('system design')) return courseIcons['System Design'];
        if (lowerTitle.includes('data structure') || lowerTitle.includes('algorithm')) return courseIcons['Data Structures & Algorithms'];
        if (lowerTitle.includes('web')) return courseIcons['Web Development'];

        return courseIcons['Default'];
    };

    const getCourseColor = (title: string) => {
        if (courseColors[title]) return courseColors[title];

        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('html')) return courseColors['HTML'];
        if (lowerTitle.includes('css')) return courseColors['CSS'];
        if (lowerTitle.includes('javascript') || lowerTitle.includes('js')) return courseColors['JavaScript'];
        if (lowerTitle.includes('react')) return courseColors['React'];

        return 'bg-[#DEC9B7]'; // Default color
    };

    const getCourseRating = (title: string) => {
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
            hash = title.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Wider range: 3.8 to 5.0
        const rating = 3.8 + (Math.abs(hash) % 13) / 10;
        return Math.min(5, rating).toFixed(1);
    };

    if (loading) {
        return (
            <div className="bg-[#F5EFE1] min-h-screen flex items-center justify-center font-source-serif">
                <h2 className="text-2xl text-[#7F6E68] font-bold animate-pulse">Loading adventure...</h2>
            </div>
        );
    }

    return (
        <div className="bg-[#F5EFE1] min-h-screen font-source-serif overflow-x-hidden">
            <Navbar />

            <main className="container mx-auto px-6 py-12">
                {/* Search & AI Section */}
                <div className="relative max-w-[2000px] mx-auto mb-16 px-1 mt-16" >
                    {/* Mascot peeking */}
                    <div className="absolute -top-14 left-8 w-20 z-0">
                        <img src="/course.png" alt="Mascot" className="w-full h-auto drop-shadow-md" />
                    </div>

                    <div className="flex gap-4 items-center relative z-10">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search roadmap..."
                                className="w-full py-4 pl-14 pr-6 rounded-[24px] bg-white border-2 border-black/5 text-lg text-[#555555] outline-none shadow-md focus:border-[#A8BDC9] transition-all font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <img src="/search.png" alt="Search" className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 opacity-60" />
                        </div>
                        <Link to="/ai-generator" className="bg-white border-2 border-black/10 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
                            <img src="/noto_magic-wand.png" alt="AI Generator" className="w-8 h-8" />
                        </Link>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((course, idx) => (
                        <div
                            key={course.id || idx}
                            className={`relative rounded-[40px] p-8 shadow-sm transition-all duration-500 hover:translate-y-[-10px] hover:shadow-2xl group overflow-hidden flex flex-col h-full border border-white/20 ${getCourseColor(course.title)}`}
                        >
                            {/* Favorite Icon */}
                            <button
                                onClick={(e) => toggleFavorite(e, course.id || idx)}
                                className={`absolute top-6 right-6 cursor-pointer transition-all duration-300 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-sm ${favorites.includes(course.id || idx) ? 'text-red-500 fill-red-500 scale-110' : 'text-white/40 hover:text-white/60'
                                    }`}
                                aria-label={favorites.includes(course.id || idx) ? "Remove from favorites" : "Add to favorites"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={`w-5 h-5 ${favorites.includes(course.id || idx) ? 'fill-current' : 'fill-none stroke-[2.5px] stroke-current'}`}
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </button>

                            {/* Circular Badge Area on Right */}
                            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-white/20 rounded-full blur-[40px] z-0 group-hover:scale-125 transition-transform duration-700"></div>

                            <div className="relative z-10 flex flex-col h-full flex-grow">
                                <div className="mb-6 flex-grow">
                                    <h3 className="text-2xl font-bold text-[#7F6E68] mb-4 leading-tight pr-12 line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
                                    <p className="text-[15px] text-[#7F6E68]/70 font-medium leading-relaxed max-w-[190px] line-clamp-3">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="flex flex-col mb-8">
                                    <span className="text-[11px] font-bold text-[#7F6E68]/60 ml-0.5 mb-1 tracking-wider">{getCourseRating(course.title)} / 5.0</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const rating = parseFloat(getCourseRating(course.title));
                                            const isFilled = star <= Math.round(rating);

                                            return (
                                                <svg
                                                    key={star}
                                                    viewBox="0 0 24 24"
                                                    className={`w-4 h-4 transition-all duration-300 ${isFilled ? 'text-yellow-500 fill-current drop-shadow-[0_0_2px_rgba(234,179,8,0.3)]' : 'text-[#7F6E68]/20 fill-none stroke-[2px] stroke-current'}`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        to={`/roadmap/${course.id}`}
                                        className="inline-flex items-center gap-2 bg-[#5A4D48] text-[#F5EFE1] font-bold py-3 px-7 rounded-2xl hover:bg-[#3D2E1F] active:scale-95 transition-all no-underline text-xs mb-8 shadow-md"
                                    >
                                        Explore <span>→</span>
                                    </Link>

                                    <div className="flex flex-wrap gap-2.5">
                                        <div className="bg-white/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-[#7F6E68] border border-white/30 truncate max-w-[110px]">
                                            Total XP: {course.lessons?.reduce((sum, lesson) => sum + (lesson.xp || 0), 0) || 1500}
                                        </div>
                                        <div className="bg-white/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-[#7F6E68] border border-white/30">
                                            ⏱ 10h
                                        </div>
                                        <div className="bg-white/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-[#7F6E68] border border-white/30">
                                            {course.lessons?.length || 4} levels
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Badge Icon Positioned Right */}
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-[140px] h-[140px] z-10 pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 opacity-90">
                                {getCourseIcon(course.title)}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Courses;
