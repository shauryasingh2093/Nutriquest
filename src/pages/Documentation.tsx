import React from 'react';
import InfoPage from '../components/InfoPage';

const Documentation: React.FC = () => {
    return (
        <InfoPage title="Documentation" lastUpdated="January 30, 2026">
            <h2>Getting Started</h2>
            <p>Learn how to navigate NutriQuest and make the most of your learning journey.</p>

            <h3>Learning Paths</h3>
            <p>Our roadmaps guide you through structured curricula designed by experts. Each path consists of:</p>
            <ul>
                <li><strong>Levels:</strong> Milestones that group related concepts.</li>
                <li><strong>Lessons:</strong> Individual topics within a level.</li>
                <li><strong>Stages:</strong> The Read, Practice, and Notes cycle for deep learning.</li>
            </ul>

            <h3>XP System</h3>
            <p>Earn XP by completing stages, acing quizzes, and maintaining streaks. Level up your profile to unlock new achievements!</p>
        </InfoPage>
    );
};

export default Documentation;
