import React from 'react';
import InfoPage from '../components/InfoPage';

const Licenses: React.FC = () => {
    return (
        <InfoPage title="Licenses & Credits" lastUpdated="January 30, 2026">
            <h2>Open Source Libraries</h2>
            <p>NutriQuest is built using these amazing open source projects:</p>
            <ul>
                <li><strong>React</strong> - MIT License</li>
                <li><strong>Vite</strong> - MIT License</li>
                <li><strong>Tailwind CSS</strong> - MIT License</li>
                <li><strong>Framer Motion</strong> - MIT License</li>
                <li><strong>Passport.js</strong> - MIT License</li>
            </ul>

            <h2>Credits</h2>
            <p><strong>Game Design & Development:</strong> Shaurya Singh</p>
            <p>All squirrel mascots and game assets are designed for NutriQuest. Icons use Material Design standards.</p>
        </InfoPage>
    );
};

export default Licenses;
