import React from 'react';

interface LoadingScreenProps {
    message?: string;
    fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = "Loading...",
    fullScreen = true
}) => {
    return (
        <div className={`flex flex-col items-center justify-center transition-all duration-700 ${fullScreen ? 'fixed inset-0 z-[9999] bg-[#F5EFE1]/98 backdrop-blur-xl' : 'h-full w-full bg-white/40 backdrop-blur-md rounded-[48px] p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50'}`}>
            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12 group">
                {/* Decorative background glow */}
                <div className="absolute inset-x-0 -inset-y-4 bg-gradient-to-t from-[#A06B92]/20 via-[#A06B92]/5 to-transparent rounded-full blur-3xl group-hover:bg-[#A06B92]/30 transition-all duration-1000 animate-pulse"></div>

                {/* Video container with cinematic frame */}
                <div className="relative w-full h-full rounded-[60px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border-8 border-white/90 transform group-hover:scale-[1.02] transition-transform duration-700">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain contrast-110 brightness-105"
                    >
                        <source src="/loadinganimation.mp4" type="video/mp4" />
                    </video>

                    {/* Inner glass overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#A06B92]/10 via-transparent to-white/5 pointer-events-none"></div>
                </div>

                {/* Floating animated rings */}
                <div className="absolute -inset-6 border-[1.5px] border-dashed border-[#7F6E68]/15 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none"></div>
                <div className="absolute -inset-10 border border-dashed border-[#7F6E68]/10 rounded-full animate-[spin_30s_linear_infinite_reverse] pointer-events-none"></div>

                {/* Mascot shadow pulse */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/5 blur-md rounded-full animate-bounce opacity-30"></div>
            </div>

            <div className="text-center px-8 relative z-10 max-w-2xl">
                <h3 className="text-3xl md:text-5xl font-black mb-5 tracking-tighter drop-shadow-sm leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4A3C36] via-[#A06B92] to-[#7F6E68] bg-[length:200%_auto] animate-text-gradient">
                        {message}
                    </span>
                </h3>
                <p className="text-[#7F6E68]/70 font-bold text-lg max-w-sm mx-auto leading-relaxed tracking-wide italic font-serif">
                    “The best time to plant a tree was 20 years ago. <br /> The second best time is now.”
                </p>
            </div>

            {/* Elegant Premium Progress Bar */}
            <div className="w-72 h-3 bg-white/60 rounded-full mt-14 overflow-hidden border border-[#7F6E68]/5 shadow-inner p-[3px]">
                <div className="h-full bg-gradient-to-r from-[#A06B92] via-[#D4A5C9] to-[#A06B92] animate-shimmer rounded-full bg-[length:200%_100%] shadow-[0_0_12px_rgba(160,107,146,0.3)]"></div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes text-gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-shimmer {
                    animation: shimmer 2.5s linear infinite;
                }
                .animate-text-gradient {
                    animation: text-gradient 4s ease infinite;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
