import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QuizQuestion from './QuizQuestion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function LessonViewer({ courseId, lessonId, onClose, onComplete }) {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [quizResults, setQuizResults] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchLesson();
    }, [courseId, lessonId]);

    const fetchLesson = async () => {
        try {
            const response = await api.get(`/lessons/${courseId}/${lessonId}`);
            setLesson(response.data.lesson);
        } catch (error) {
            console.error('Error fetching lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextSection = () => {
        if (currentSection < lesson.content.sections.length - 1) {
            setCurrentSection(currentSection + 1);
        } else {
            setShowQuiz(true);
        }
    };

    const handlePreviousSection = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    const handleAnswer = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
        setShowFeedback(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < lesson.quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowFeedback(false);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        try {
            const response = await api.post(`/lessons/${courseId}/${lessonId}/submit-quiz`, {
                answers
            });
            setQuizResults(response.data);
            setQuizComplete(true);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const handleCompleteLesson = () => {
        onComplete(quizResults);
    };

    if (loading) {
        return (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Loading lesson...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Lesson not found</h2>
                        <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{lesson.title}</h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                            {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)} • {lesson.estimatedMinutes} min
                        </p>
                    </div>
                    <button onClick={onClose} style={styles.closeButton}>✕</button>
                </div>

                {/* Content */}
                <div style={styles.content}>
                    {!showQuiz && !quizComplete && (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            {/* Introduction */}
                            {currentSection === 0 && (
                                <div style={styles.introSection}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>📚</div>
                                    <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', textAlign: 'center' }}>
                                        {lesson.title}
                                    </h3>
                                    <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
                                        {lesson.content.introduction}
                                    </p>
                                </div>
                            )}

                            {/* Section Content */}
                            {currentSection > 0 && currentSection <= lesson.content.sections.length && (
                                <div style={styles.section}>
                                    {(() => {
                                        const section = lesson.content.sections[currentSection - 1];
                                        return (
                                            <>
                                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-accent-primary)' }}>
                                                    {section.title}
                                                </h3>
                                                <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                                    {section.content}
                                                </p>

                                                {section.keyPoints && (
                                                    <div style={styles.keyPoints}>
                                                        <h4 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', fontWeight: '700' }}>
                                                            Key Points:
                                                        </h4>
                                                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                                            {section.keyPoints.map((point, index) => (
                                                                <li key={index} style={{ marginBottom: '0.5rem' }}>{point}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {section.example && (
                                                    <div style={styles.exampleBox}>
                                                        <h4 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', fontWeight: '700' }}>
                                                            💡 Example:
                                                        </h4>
                                                        <pre style={styles.codeBlock}>
                                                            <code>{section.example.code}</code>
                                                        </pre>
                                                        <p style={{ marginTop: '1rem', fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                                                            {section.example.explanation}
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                    {showQuiz && !quizComplete && (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Quiz Time! 🎯</h3>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    Test your knowledge to complete this lesson
                                </p>
                            </div>
                            <QuizQuestion
                                question={lesson.quiz.questions[currentQuestion]}
                                questionNumber={currentQuestion + 1}
                                totalQuestions={lesson.quiz.questions.length}
                                onAnswer={handleAnswer}
                                selectedAnswer={answers[currentQuestion]}
                                showFeedback={showFeedback}
                            />
                        </div>
                    )}

                    {quizComplete && (
                        <div style={{ textAlign: 'center', padding: '2rem', animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                {quizResults.score >= 70 ? '🎉' : '📚'}
                            </div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                                {quizResults.passed ? 'Congratulations!' : 'Keep Learning!'}
                            </h3>
                            <div style={styles.scoreCard}>
                                <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--color-accent-primary)' }}>
                                    {quizResults.score}%
                                </div>
                                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0' }}>
                                    {quizResults.correctCount} out of {quizResults.totalQuestions} correct
                                </p>
                            </div>
                            {quizResults.passed ? (
                                <p style={{ fontSize: '1.0625rem', marginTop: '1.5rem', lineHeight: '1.6' }}>
                                    Great job! You've mastered this lesson. Keep up the excellent work! 🚀
                                </p>
                            ) : (
                                <p style={{ fontSize: '1.0625rem', marginTop: '1.5rem', lineHeight: '1.6' }}>
                                    Don't worry! Review the material and try again. You're making progress! 💪
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    {!showQuiz && !quizComplete && (
                        <>
                            {currentSection > 0 && (
                                <button onClick={handlePreviousSection} className="btn btn-outline">
                                    ← Previous
                                </button>
                            )}
                            <button onClick={handleNextSection} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                                {currentSection < lesson.content.sections.length ? 'Next →' : 'Start Quiz →'}
                            </button>
                        </>
                    )}
                    {showQuiz && !quizComplete && showFeedback && (
                        <button onClick={handleNextQuestion} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                            {currentQuestion < lesson.quiz.questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                        </button>
                    )}
                    {quizComplete && quizResults.passed && (
                        <button onClick={handleCompleteLesson} className="btn btn-primary" style={{ margin: '0 auto' }}>
                            Complete Lesson & Earn {lesson.xp} XP! 🎯
                        </button>
                    )}
                    {quizComplete && !quizResults.passed && (
                        <button onClick={onClose} className="btn btn-outline" style={{ margin: '0 auto' }}>
                            Review & Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.3s ease'
    },
    modal: {
        backgroundColor: 'var(--color-white)',
        borderRadius: '20px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.4s ease'
    },
    header: {
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
        padding: '0.5rem',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        ':hover': {
            backgroundColor: 'var(--color-bg-secondary)'
        }
    },
    content: {
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
    },
    footer: {
        padding: '1.5rem 2rem',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: '1rem'
    },
    introSection: {
        textAlign: 'center',
        padding: '2rem 0'
    },
    section: {
        maxWidth: '700px',
        margin: '0 auto'
    },
    keyPoints: {
        backgroundColor: 'var(--color-bg-secondary)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem'
    },
    exampleBox: {
        backgroundColor: '#f8f9fa',
        border: '2px solid var(--color-accent-primary)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '1.5rem'
    },
    codeBlock: {
        backgroundColor: '#2d2d2d',
        color: '#f8f8f2',
        padding: '1rem',
        borderRadius: '8px',
        overflow: 'auto',
        fontSize: '0.875rem',
        lineHeight: '1.6',
        fontFamily: 'monospace'
    },
    scoreCard: {
        backgroundColor: 'var(--color-bg-secondary)',
        padding: '2rem',
        borderRadius: '16px',
        marginTop: '1.5rem',
        display: 'inline-block',
        minWidth: '250px'
    }
};

LessonViewer.propTypes = {
    courseId: PropTypes.string.isRequired,
    lessonId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired
};
