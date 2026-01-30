import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const Landing: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/courses');
        }
    }, [user, loading, navigate]);

    const [showLoading, setShowLoading] = React.useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            timer = setTimeout(() => setShowLoading(true), 500);
        } else {
            setShowLoading(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    if (loading) {
        if (!showLoading) return null;
        return <LoadingScreen message="Welcoming you back..." />;
    }
    return (
        <div className="font-source-serif bg-landing-bg min-h-screen m-0 overflow-x-hidden text-landing-dark">
            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full px-8 py-6 flex justify-between items-center bg-transparent z-20">
                <div className="flex items-center text-[28px] font-bold text-landing-logo tracking-tight">
                    <img src="/2.png" alt="NutriQuest Logo" className="w-[60px] h-[60px] mr-3 object-contain" />
                    NutriQuest
                </div>
                <ul className="list-none flex gap-8 m-0 p-0 items-center">
                    <li>
                        <Link to="/login" className="no-underline text-landing-dark font-bold hover:opacity-70 transition-all text-sm uppercase tracking-widest">LOG IN</Link>
                    </li>
                    <li>
                        <Link to="/signup" className="no-underline text-landing-dark font-bold rounded-xl transition-all duration-300 px-8 py-3 bg-landing-bg border-2 border-landing-logo shadow-sm hover:shadow-md hover:scale-[1.02] text-sm uppercase tracking-widest">SIGN UP</Link>
                    </li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="relative flex flex-col md:flex-row justify-between items-center bg-landing-hero-bg px-10 md:px-24 pt-48 pb-32 min-h-screen box-border overflow-hidden">
                <div className="max-w-2xl z-10 text-center md:text-left transition-all duration-700">
                    <h2 className="text-landing-logo text-6xl md:text-[64px] font-bold leading-[1.1] mb-10 tracking-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.12)]">
                        Level up Your<br />
                        <span className="text-[#EEE3CB] drop-shadow-sm">Learning</span> Journey
                    </h2>
                    <p className="text-2xl md:text-3xl mb-14 text-landing-logo font-bold opacity-90 leading-relaxed max-w-lg">Your roadmap, one acorn at a time.</p>
                    <Link to="/signup" className="bg-landing-dark text-white border-none px-12 py-6 text-xl font-bold cursor-pointer rounded-2xl shadow-[-1px_-1px_30px_0_rgba(255,236,153,0.3)] no-underline inline-flex items-center gap-4 hover:scale-[1.05] hover:-translate-y-1 hover:shadow-[-1px_-1px_40px_0_rgba(255,236,153,0.5)] transition-all group relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-4">
                            Let the magic begin <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </span>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                </div>

                <div className="relative mt-16 md:mt-0 animate-float">
                    <div className="w-[340px] h-[340px] md:w-[500px] md:h-[500px] flex justify-center items-center rounded-[140px] bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 rotate-3 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_80px_rgba(155,89,182,0.35)] transition-shadow duration-300">
                        {/* Inner highlights for glassmorphism */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                        <img src="/1.png" alt="Squirrel reading" className="w-2/3 h-auto -rotate-3 hover:scale-110 transition-transform duration-700 select-none drop-shadow-2xl" />
                    </div>
                    {/* Subtle outer glow */}
                    <div className="absolute -inset-4 bg-purple/10 blur-2xl rounded-full -z-10 animate-pulse"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-[10%] w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-landing-logo/10 rounded-full blur-3xl pointer-events-none"></div>
            </section>

            {/* About Section */}
            <section className="relative bg-landing-bg py-32 px-10 text-center min-h-[500px] flex flex-col items-center justify-center overflow-visible">
                <img src="/6.png" alt="Left Mascot" className="absolute left-8 bottom-20 w-[150px] md:w-[220px] h-auto z-10 hidden lg:block hover:translate-y-[-10px] transition-transform" />

                <div className="max-w-3xl mx-auto z-10">
                    <h3 className="text-4xl md:text-5xl font-bold text-landing-brown mb-8 tracking-tight">About NutriQuest</h3>
                    <p className="text-xl md:text-2xl text-landing-brown leading-relaxed opacity-90 font-medium">
                        NutriQuest transforms learning into an adventure. With personalized roadmaps, fun challenges, and rewarding milestones, you'll stay motivated as you level up your skills and knowledge.
                    </p>
                </div>

                <div className="absolute right-8 bottom-10 w-[150px] md:w-[220px] h-auto z-10 hidden lg:block">
                    <img src="/7.png" alt="Right Mascot" className="w-full h-auto hover:translate-y-[-10px] transition-transform" />
                    <img src="/8.png" alt="Star" className="absolute -top-6 -right-4 w-16 h-auto drop-shadow-lg animate-pulse" />
                </div>
            </section>

            {/* Journey Section */}
            <section className="relative bg-[url('/3.png')] bg-no-repeat bg-center bg-cover py-48 flex items-center justify-center overflow-visible min-h-[700px]">
                {/* Background Softening Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-landing-bg via-landing-bg/40 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

                {/* Mascot nudged closer for storytelling - quieter 'Easter egg' presence */}
                <img src="/4.png" alt="Journey Mascot" className="absolute left-[8%] bottom-12 w-32 md:w-56 h-auto z-10 hidden xl:block drop-shadow-xl opacity-80 hover:opacity-100 transition-all duration-700 hover:scale-105" />

                <div className="container mx-auto px-10 flex flex-col xl:flex-row items-center xl:justify-between relative z-10">
                    <div className="max-w-[580px] text-center xl:text-left">
                        <h3 className="text-4xl md:text-6xl font-extrabold text-[#7F6E68] mb-10 tracking-tight drop-shadow-sm">
                            Rewarding Journey
                        </h3>
                        <div className="text-[#7F6E68] mb-12 text-xl md:text-2xl font-bold leading-relaxed opacity-95">
                            Collect badges, earn streaks, and celebrate every win. <br className="hidden md:block" /> Your journey is filled with rewards that keep you inspired to keep growing.
                        </div>
                    </div>

                    <div className="w-full max-w-[500px] bg-gradient-to-br from-white/25 to-white/5 backdrop-blur-3xl p-8 md:p-14 rounded-[56px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.35)] border border-white/40 relative transition-all duration-500 hover:shadow-[0_50px_120px_-20px_rgba(0,0,0,0.45)] group/card">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24">
                            <img src="/8.png" alt="Star" className="w-full drop-shadow-2xl animate-pulse-glow" />
                        </div>

                        <ul className="list-none p-0 m-0 space-y-8 mt-6">
                            {[
                                { text: "Unlocking achievements as you learn.", icon: "✧" },
                                { text: "Track progress with daily quests.", icon: "✧" },
                                { text: "Turn skills into streaks and milestones.", icon: "✧" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center text-xl font-bold text-[#7F6E68] group/item cursor-default transition-all duration-300 hover:translate-x-2">
                                    <span className="text-3xl mr-6 text-landing-logo transition-transform duration-300 group-hover/item:scale-125">{item.icon}</span>
                                    <div className="flex-1 flex justify-between items-center opacity-90 group-hover/item:opacity-100">
                                        {item.text}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="bg-landing-bg py-48 px-10 flex justify-center items-center">
                <div className="relative bg-landing-community-card/60 backdrop-blur-md rounded-[64px] py-24 px-12 md:px-24 max-w-5xl w-full text-center shadow-xl border border-white/20">
                    <h3 className="text-4xl md:text-5xl font-bold text-[#8b7355] mb-8 tracking-tight">Join the Community</h3>
                    <p className="text-xl md:text-2xl text-[#8b7355] mb-16 max-w-2xl mx-auto font-medium opacity-90">
                        Earn badges and achievements as you progress, motivating you to continue your journey and achieve your goals.
                    </p>
                    <Link to="/signup" className="bg-transparent border-2 border-[#8b7355] text-[#8b7355] px-12 py-4 rounded-full text-xl font-bold cursor-pointer mb-16 transition-all no-underline inline-block hover:bg-[#8b7355] hover:text-white hover:scale-105 shadow-sm">Join the Quest</Link>

                    <div className="flex justify-center gap-6 mb-8">
                        <a href="#" className="flex items-center justify-center w-14 h-14 bg-[#8b7355] rounded-full text-white transition-all hover:bg-landing-dark hover:scale-110 hover:shadow-md">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
                        </a>
                        <a href="#" className="flex items-center justify-center w-14 h-14 bg-[#8b7355] rounded-full text-white transition-all hover:bg-landing-dark hover:scale-110 hover:shadow-md">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.31,80.1a105.77,105.77,0,0,0,32.32,16.25,80.06,80.06,0,0,0,6.89-11.11,68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.35-16.27c2.47-27.14-4.27-50.84-18.7-72.04ZM42.45,65.69C36.18,65.69,31,60,31,53s5.09-12.73,11.48-12.73S54,46,53.92,53,48.81,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.09-12.73,11.44-12.73S96.23,46,96.15,53,91,65.69,84.69,65.69Z" /></svg>
                        </a>
                        <a href="#" className="flex items-center justify-center w-14 h-14 bg-[#8b7355] rounded-full text-white transition-all hover:bg-landing-dark hover:scale-110 hover:shadow-md">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                    </div>

                    <img src="/5.png" alt="Community Mascot" className="absolute w-48 md:w-64 h-auto -bottom-4 -left-12 drop-shadow-lg hidden md:block" />
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-landing-journey-card/40 backdrop-blur-sm text-landing-dark pt-24 pb-12 px-10 border-t border-landing-logo/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-7xl mx-auto mb-20">
                    <div>
                        <h4 className="text-xl font-bold mb-6 opacity-80 uppercase tracking-widest text-sm text-landing-dark">Product</h4>
                        <ul className="list-none p-0 m-0 space-y-4">
                            <li><Link to="/features" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">Features</Link></li>
                            <li><Link to="/updates" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">Updates</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-6 opacity-80 uppercase tracking-widest text-sm text-landing-dark">Company</h4>
                        <ul className="list-none p-0 m-0 space-y-4">
                            <li><Link to="/about" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">About</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-6 opacity-80 uppercase tracking-widest text-sm text-landing-dark">Services</h4>
                        <ul className="list-none p-0 m-0 space-y-4">
                            <li><Link to="/documentation" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">Documentation</Link></li>
                            <li><Link to="/tutorials" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">Tutorials</Link></li>
                            <li><Link to="/support" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-6 opacity-80 uppercase tracking-widest text-sm text-landing-dark">Values</h4>
                        <ul className="list-none p-0 m-0 space-y-4">
                            <li><Link to="/privacy" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">Terms</Link></li>
                            <li><Link to="/licenses" className="no-underline text-landing-dark font-medium hover:opacity-70 transition-opacity">Licenses</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center pt-12 border-t border-landing-logo/10">
                    <p className="m-0 text-sm font-bold opacity-60">© 2025 NutriQuest | Made by Shaurya Singh</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;


