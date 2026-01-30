import React from 'react';
import InfoPage from '../components/InfoPage';

const TermsOfService: React.FC = () => {
    return (
        <InfoPage title="Terms of Service" lastUpdated="January 30, 2026">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using NutriQuest, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2>2. Educational Content</h2>
            <p>NutriQuest is an educational platform. While we strive for accuracy, the content is for educational purposes only.</p>

            <h2>3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password.</p>

            <h2>4. Usage</h2>
            <p>You agree to use NutriQuest only for lawful purposes and in a way that does not infringe the rights of others.</p>
        </InfoPage>
    );
};

export default TermsOfService;
