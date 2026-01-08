import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

interface Badge {
    id: string;
    name: string;
    description: string;
    image: string;
    unlocked: boolean;
}

const Achievements: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const isUnlocked = (id: string) => (user.achievements || []).some(a => a.id === id);

    const badges: Badge[] = [
        {
            id: 'first-lesson',
            name: 'First Steps',
            description: 'Complete your first lesson',
            image: '/b1.png',
            unlocked: isUnlocked('first-lesson')
        },
        {
            id: '5-lessons',
            name: 'Getting Started',
            description: 'Complete 5 lessons',
            image: '/b2.png',
            unlocked: isUnlocked('5-lessons')
        },
        {
            id: '10-lessons',
            name: 'Dedicated Learner',
            description: 'Complete 10 lessons',
            image: '/b3.png',
            unlocked: isUnlocked('10-lessons')
        },
        {
            id: '25-lessons',
            name: 'Knowledge Seeker',
            description: 'Complete 25 lessons',
            image: '/b4.png',
            unlocked: isUnlocked('25-lessons')
        },
        {
            id: '50-lessons',
            name: 'Master Student',
            description: 'Complete 50 lessons',
            image: '/b5.png',
            unlocked: isUnlocked('50-lessons')
        },
        {
            id: '3-day-streak',
            name: 'Consistency',
            description: 'Maintain a 3-day streak',
            image: '/b6.png',
            unlocked: isUnlocked('3-day-streak')
        },
        {
            id: '7-day-streak',
            name: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            image: '/b7.png',
            unlocked: isUnlocked('7-day-streak')
        },
        {
            id: '30-day-streak',
            name: 'Unstoppable',
            description: 'Maintain a 30-day streak',
            image: '/b8.png',
            unlocked: isUnlocked('30-day-streak')
        },
        {
            id: '1000-xp',
            name: 'XP Hunter',
            description: 'Earn 1000 XP',
            image: '/b9.png',
            unlocked: isUnlocked('1000-xp')
        },
        {
            id: '5000-xp',
            name: 'XP Master',
            description: 'Earn 5000 XP',
            image: '/b10.png',
            unlocked: isUnlocked('5000-xp')
        },
    ];

    const unlockedCount = (user.achievements || []).length;

    return (
        <div className="bg-[#F5EFE1] min-h-screen font-source-serif">
            <Navbar />

            <div className="min-h-screen bg-[#F5EFE1] py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-black text-[#333333] mb-3">Your Achievements</h1>
                        <p className="text-[#7F6E68] text-lg font-medium">Celebrate your learning journey and unlock new milestones.</p>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-[#4A3C36] rounded-[30px] p-8 mb-12 shadow-xl">
                        <div className="grid grid-cols-3 gap-8">
                            {/* Badges Earned */}
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-[#7F8C9A] rounded-full flex items-center justify-center mb-3">
                                    <img src="/Reward ribbons.png" alt="Badges" className="w-12 h-12" />
                                </div>
                                <p className="text-white/80 text-sm font-bold mb-1">{unlockedCount}</p>
                                <p className="text-white text-base font-bold">Badges Earned</p>
                            </div>

                            {/* Day Streak */}
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-[#7F8C9A] rounded-full flex items-center justify-center mb-3">
                                    <img src="/fire flame.png" alt="Streak" className="w-12 h-12" />
                                </div>
                                <p className="text-white/80 text-sm font-bold mb-1">{user.streak}</p>
                                <p className="text-white text-base font-bold">Day Streak</p>
                            </div>

                            {/* Total XP */}
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-[#7F8C9A] rounded-full flex items-center justify-center mb-3">
                                    <img src="/star.png" alt="XP" className="w-12 h-12" />
                                </div>
                                <p className="text-white/80 text-sm font-bold mb-1">{user.xp}</p>
                                <p className="text-white text-base font-bold">Total XP</p>
                            </div>
                        </div>
                    </div>

                    {/* Badges Section */}
                    <div className="relative">
                        {/* Mascot - positioned absolutely on the far left */}
                        <div className="absolute -left-40 -top-17">
                            <img src="/achivement.png" alt="Mascot" className="w-42 h-auto drop-shadow-2xl" />
                        </div>

                        {/* Badges Grid - aligned with stats section */}
                        <div>
                            <h2 className="text-3xl font-black text-[#333333] mb-6">Badges</h2>
                            <div className="grid grid-cols-5 gap-4">
                                {badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`relative rounded-[20px] p-4 transition-all ${badge.unlocked
                                            ? 'bg-[#B8D4E8] border-4 border-yellow-400 shadow-lg hover:scale-105'
                                            : 'bg-[#8B8B8B] opacity-80'
                                            }`}
                                    >
                                        <div className="aspect-square relative">
                                            <img
                                                src={badge.image}
                                                alt={badge.name}
                                                className={`w-full h-full object-contain ${!badge.unlocked ? 'opacity-50' : ''}`}
                                            />
                                            {!badge.unlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <img src="/lock1.png" alt="Locked" className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center mt-2">
                                            <p className={`font-black text-sm ${badge.unlocked ? 'text-[#333333]' : 'text-white/70'}`}>
                                                {badge.name}
                                            </p>
                                            <p className={`text-xs ${badge.unlocked ? 'text-[#7F6E68]' : 'text-white/50'}`}>
                                                {badge.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Achievements;
