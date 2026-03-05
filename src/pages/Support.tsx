import React, { useState } from 'react';
import InfoPage from '../components/InfoPage';

const faqs = [
    { q: "I can't access the next level.", a: "Make sure you've completed all three stages (Read, Practice, Notes) of every lesson in your current level. The next level unlocks automatically once all lessons are finished." },
    { q: "My streak disappeared.", a: "Streaks reset if you miss a full calendar day without completing any lesson stage. Try to do at least one small activity daily to keep your streak alive!" },
    { q: "The AI Generator isn't working.", a: "AI generation requires an active internet connection and may take a few seconds. If it fails, try refreshing the page. If the issue persists, clear your browser cache." },
    { q: "My progress isn't saving.", a: "Make sure you're logged in. Progress syncs automatically to the cloud. If you're on a slow connection, give it a moment — your data will sync once connectivity is restored." },
    { q: "How do I change my profile picture?", a: "Go to your Profile page and click on your avatar. You can upload a new image or use your Google account avatar if you signed in with Google." },
    { q: "Can I reset my progress on a course?", a: "Currently, course progress cannot be reset. This is by design to protect your hard-earned achievements and XP. You can always revisit completed lessons for review." },
];

const Support: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <InfoPage title="Support" lastUpdated="March 2026">
            <div className="not-prose">
                {/* Contact Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-gradient-to-br from-[#E3F2FD] to-[#E8EAF6] p-8 rounded-3xl border border-[#90CAF9]/30 text-center group hover:-translate-y-1 transition-all duration-300">
                        <div className="text-4xl mb-4">📧</div>
                        <h3 className="text-lg font-bold text-[#1565C0] mb-2">Email Us</h3>
                        <p className="text-[#1976D2] m-0 text-sm">support@nutriquest.com</p>
                        <p className="text-[#42A5F5] m-0 text-xs mt-2">Response within 24 hours</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] p-8 rounded-3xl border border-[#C5E1A5]/30 text-center group hover:-translate-y-1 transition-all duration-300">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-lg font-bold text-[#2E7D32] mb-2">Community</h3>
                        <p className="text-[#388E3C] m-0 text-sm">Join our Discord server</p>
                        <p className="text-[#66BB6A] m-0 text-xs mt-2">Active community of learners</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFF3E0] p-8 rounded-3xl border border-[#FFE082]/30 text-center group hover:-translate-y-1 transition-all duration-300">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-lg font-bold text-[#F57F17] mb-2">Documentation</h3>
                        <p className="text-[#F9A825] m-0 text-sm">Browse our docs & tutorials</p>
                        <p className="text-[#FBC02D] m-0 text-xs mt-2">Self-serve knowledge base</p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 className="text-3xl font-bold text-[#5D4037] mb-8 flex items-center gap-3">
                        <span className="bg-[#FBE9E7] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm">❓</span>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === i ? 'border-[#8B4513]/30 shadow-md' : 'border-[#EFEBE9] shadow-sm hover:shadow-md'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left bg-transparent border-none cursor-pointer group"
                                >
                                    <span className="text-lg font-bold text-[#5D4037] pr-4">{faq.q}</span>
                                    <span className={`text-[#8B4513] text-2xl flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}>
                                        +
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="px-6 pb-6 pt-0 m-0 text-[#795548] leading-relaxed border-t border-[#EFEBE9] pt-4 mx-6">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Still Need Help */}
                <div className="mt-16 bg-gradient-to-br from-[#5D4037] to-[#4E342E] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="text-5xl mb-4">🐿️</div>
                        <h3 className="text-2xl font-bold text-[#FFE082] mb-3">Still Need Help?</h3>
                        <p className="text-white/80 max-w-lg mx-auto mb-6 leading-relaxed m-0">
                            Our team is always happy to help. Drop us an email and we'll get back to you as soon as possible.
                        </p>
                        <a
                            href="mailto:support@nutriquest.com"
                            className="inline-block bg-[#FFE082] text-[#5D4037] px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider no-underline hover:bg-[#FFD54F] transition-colors shadow-md"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </InfoPage>
    );
};

export default Support;
