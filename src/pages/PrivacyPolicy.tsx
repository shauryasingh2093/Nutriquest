import React from 'react';
import InfoPage from '../components/InfoPage';

const PrivacyPolicy: React.FC = () => {
    return (
        <InfoPage title="Privacy Policy" lastUpdated="January 30, 2026">
            <h2>1. Introduction</h2>
            <p>Welcome to NutriQuest. We respect your privacy and are committed to protecting your personal data.</p>

            <h2>2. Data We Collect</h2>
            <p>We collect data to provide you with the best learning experience, including:</p>
            <ul>
                <li>Account information (name, email)</li>
                <li>Learning progress and quiz scores</li>
                <li>Notes and saved content</li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <p>Your data is used solely to:</p>
            <ul>
                <li>Track your learning journey</li>
                <li>Personalize your roadmap</li>
                <li>Improve our course content</li>
            </ul>

            <h2>4. Contact Us</h2>
            <p>If you have questions about this policy, please contact us at privacy@nutriquest.com.</p>
        </InfoPage>
    );
};

export default PrivacyPolicy;
