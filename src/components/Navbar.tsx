import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = (): void => {
        logout();
        navigate('/');
    };

    const isActive = (path: string): boolean => location.pathname === path;

    if (!user) {
        return null;
    }

    return (
        <nav className="bg-[#A8BDC9] shadow-md sticky top-0 z-50 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Navigation Links */}
                    <ul className="flex gap-8 items-center list-none p-0 m-0">
                        <li>
                            <Link
                                to="/courses"
                                className={`text-lg transition-all no-underline ${isActive('/courses')
                                    ? 'text-[#555555] font-bold border-b-2 border-white/60 pb-0.5'
                                    : 'text-[#555555]/60 font-medium hover:text-[#555555] hover:opacity-100'
                                    }`}
                            >
                                Courses
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/ai-generator"
                                className={`text-lg transition-all no-underline ${isActive('/ai-generator')
                                    ? 'text-[#555555] font-bold border-b-2 border-white/60 pb-0.5'
                                    : 'text-[#555555]/60 font-medium hover:text-[#555555] hover:opacity-100'
                                    }`}
                            >
                                AI Generator
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/progress"
                                className={`text-lg transition-all no-underline ${isActive('/progress')
                                    ? 'text-[#555555] font-bold border-b-2 border-white/60 pb-0.5'
                                    : 'text-[#555555]/60 font-medium hover:text-[#555555] hover:opacity-100'
                                    }`}
                            >
                                Progress
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/achievements"
                                className={`text-lg transition-all no-underline ${isActive('/achievements')
                                    ? 'text-[#555555] font-bold border-b-2 border-white/60 pb-0.5'
                                    : 'text-[#555555]/60 font-medium hover:text-[#555555] hover:opacity-100'
                                    }`}
                            >
                                Achievement
                            </Link>
                        </li>
                    </ul>

                    {/* User Stats & Profile */}
                    <div className="flex items-center gap-6">

                        {/* XP Badge */}
                        <Link to="/achievements" className="no-underline">
                            <div className="bg-[#333333] text-white px-3 py-2 rounded-lg flex flex-col gap-1 shadow-inner min-w-[120px] h-[44px] justify-center transition-all hover:scale-[1.02] cursor-pointer border border-white/5 group">
                                <div className="flex items-center gap-2 font-bold text-[10px] leading-none">
                                    <img src="/star.png" alt="XP" className="w-3.5 h-3.5 shrink-0 object-contain" />
                                    <span className="tracking-tight uppercase opacity-80">{user.xp || 0} XP</span>
                                </div>
                                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-yellow-400 to-yellow-200 h-full rounded-full shadow-[0_0_8px_rgba(250,204,21,0.2)] transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min((user.xp % 1000) / 10, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </Link>

                        {/* Streak Badge */}
                        <Link to="/achievements" className="no-underline">
                            <div className="bg-[#333333] text-white px-3 py-2 rounded-lg flex flex-col gap-1 shadow-inner min-w-[120px] h-[44px] justify-center transition-all hover:scale-[1.02] cursor-pointer border border-white/5 group">
                                <div className="flex items-center gap-2 font-bold text-[10px] leading-none">
                                    <img src="/fire flame.png" alt="Streak" className="w-3.5 h-3.5 shrink-0 object-contain" />
                                    <span className="tracking-tight uppercase opacity-80 whitespace-nowrap">{user.streak || 0} Day Streak</span>
                                </div>
                                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-orange-300 h-full rounded-full shadow-[0_0_8px_rgba(249,115,22,0.2)] transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min(((user.streak || 0) / 7) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </Link>

                        {/* Profile Icon with Dropdown */}
                        <div className="relative group">
                            <Link to="/profile">
                                <div className="w-10 h-10 rounded-full bg-[#A8BDC9] border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden shadow-sm">
                                    <img src={user.avatar || "/progress.png"} alt="Profile" className="w-full h-full object-cover" onError={(e: any) => { e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Squirrel'; }} />
                                </div>
                            </Link>

                            {/* Dropdown menu on hover */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 z-50">
                                <div className="p-4 border-b border-gray-100">
                                    <p className="text-sm font-black text-[#333333] leading-tight">{user.name}</p>
                                    <p className="text-xs font-bold text-[#7F6E68] mt-1">Level {user.level || 1}</p>
                                </div>
                                <div className="p-2">
                                    <Link
                                        to="/profile"
                                        className="block px-3 py-2 text-sm font-bold text-[#7F6E68] hover:bg-[#F5EFE1] hover:text-[#333333] rounded-lg transition-colors"
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
