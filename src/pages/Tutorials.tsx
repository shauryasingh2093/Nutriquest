import React from 'react';
import InfoPage from '../components/InfoPage';

const Tutorials: React.FC = () => {
    return (
        <InfoPage title="Tutorials" lastUpdated="January 30, 2026">
            <h2>How-To Guides</h2>

            <h3>How to Start a Course</h3>
            <ol>
                <li>Go to the <strong>Courses</strong> page from the dashboard.</li>
                <li>Click on a topic card (e.g., Web Development).</li>
                <li>Press <strong>Start</strong> to begin your roadmap at Level 0.</li>
            </ol>

            <h3>How to Maintain a Streak</h3>
            <p>Complete at least one lesson stage (Read, Practice, or Notes) every day. A flame icon in the top right shows your current streak!</p>

            <h3>Using the AI Generator</h3>
            <p>Enter any topic in the AI Generator page, and NutriQuest will build a custom learning roadmap just for you.</p>
        </InfoPage>
    );
};

export default Tutorials;
