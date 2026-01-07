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

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

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
}

export default App;
