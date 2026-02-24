import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showHome?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    title = "Oops! Something went wrong",
    message = "We're having trouble reaching our servers. Please try again or head back home.",
    onRetry,
    showHome = true
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/30 backdrop-blur-md rounded-[40px] border border-white/20 shadow-xl max-w-2xl mx-auto my-12 animate-fadeIn">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-black text-[#7F6E68] mb-4 tracking-tight">{title}</h2>
            <p className="text-[#7F6E68]/70 font-bold mb-10 leading-relaxed text-lg">{message}</p>

            <div className="flex flex-wrap gap-4 justify-center">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-[#7F6E68] text-white font-black py-4 px-8 rounded-2xl shadow-lg hover:bg-[#6D5A54] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Try Again
                    </button>
                )}

                {showHome && (
                    <Link
                        to="/courses"
                        className="bg-white text-[#7F6E68] font-black py-4 px-8 rounded-2xl shadow-md border border-[#7F6E68]/10 hover:bg-[#F5EFE1]/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Browse Courses
                    </Link>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ErrorState;
