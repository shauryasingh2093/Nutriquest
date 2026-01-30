import React from 'react';
import InfoPage from '../components/InfoPage';

const Support: React.FC = () => {
    return (
        <InfoPage title="Support" lastUpdated="January 30, 2026">
            <h2>Need Help?</h2>
            <p>We're here to help you get back to learning!</p>

            <h3>Common Issues</h3>
            <details className="mb-4">
                <summary className="cursor-pointer font-bold text-[#8B4513]">I can't access the next level.</summary>
                <p className="mt-2 text-sm">Make sure you've completed all stages (Read, Practice, Notes) of the current lesson. The next level unlocks automatically.</p>
            </details>

            <details className="mb-4">
                <summary className="cursor-pointer font-bold text-[#8B4513]">My streak disappeared.</summary>
                <p className="mt-2 text-sm">Streaks reset if you miss a day. Try to do at least one small activity daily!</p>
            </details>

            <h3>Contact Us</h3>
            <p>Still stuck? Email us at support@nutriquest.com.</p>
        </InfoPage>
    );
};

export default Support;
