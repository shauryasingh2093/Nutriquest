import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import Roadmap from './pages/Roadmap';
import Progress from './pages/Progress';
import AIGenerator from './pages/AIGenerator';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import About from './pages/About';
import Features from './pages/Features';
import Updates from './pages/Updates';
import Documentation from './pages/Documentation';
import Tutorials from './pages/Tutorials';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Licenses from './pages/Licenses';
import SSOCallback from './pages/SSOCallback';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth/callback" element={<SSOCallback />} />

                    {/* Marketing & Support Pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/updates" element={<Updates />} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route path="/tutorials" element={<Tutorials />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/licenses" element={<Licenses />} />

                    {/* Protected Routes */}

                    <Route
                        path="/courses"
                        element={
                            <ProtectedRoute>
                                <Courses />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/roadmap/:courseId"
                        element={
                            <ProtectedRoute>
                                <Roadmap />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/progress"
                        element={
                            <ProtectedRoute>
                                <Progress />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ai-generator"
                        element={
                            <ProtectedRoute>
                                <AIGenerator />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/achievements"
                        element={
                            <ProtectedRoute>
                                <Achievements />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
