import { useState } from 'react';
import PropTypes from 'prop-types';

export default function QuizQuestion({ question, questionNumber, totalQuestions, onAnswer, selectedAnswer, showFeedback }) {
    const [hoveredOption, setHoveredOption] = useState(null);

    const handleOptionClick = (index) => {
        if (!showFeedback) {
            onAnswer(index);
        }
    };

    const getOptionStyle = (index) => {
        const baseStyle = {
            padding: '1rem 1.5rem',
            margin: '0.75rem 0',
            borderRadius: '12px',
            border: '2px solid',
            cursor: showFeedback ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1rem',
            textAlign: 'left'
        };

        if (showFeedback) {
            if (index === question.correctAnswer) {
                return {
                    ...baseStyle,
                    backgroundColor: '#d4edda',
                    borderColor: '#28a745',
                    color: '#155724',
                    fontWeight: '600'
                };
            } else if (index === selectedAnswer) {
                return {
                    ...baseStyle,
                    backgroundColor: '#f8d7da',
                    borderColor: '#dc3545',
                    color: '#721c24',
                    fontWeight: '600'
                };
            }
        } else if (selectedAnswer === index) {
            return {
                ...baseStyle,
                backgroundColor: 'var(--color-accent-primary)',
                borderColor: 'var(--color-accent-primary)',
                color: 'white',
                transform: 'translateX(4px)'
            };
        } else if (hoveredOption === index) {
            return {
                ...baseStyle,
                borderColor: 'var(--color-accent-primary)',
                backgroundColor: 'var(--color-bg-secondary)',
                transform: 'translateX(4px)'
            };
        }

        return {
            ...baseStyle,
            backgroundColor: 'var(--color-white)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)'
        };
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {/* Progress indicator */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <span style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: '600'
                }}>
                    Question {questionNumber} of {totalQuestions}
                </span>
                <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: '2px',
                    marginTop: '0.5rem',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${(questionNumber / totalQuestions) * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--color-accent-primary)',
                        transition: 'width 0.5s ease',
                        borderRadius: '2px'
                    }} />
                </div>
            </div>

            {/* Question */}
            <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '2rem'
            }}>
                <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '1.5rem',
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.6'
                }}>
                    {question.question}
                </h3>

                {/* Options */}
                <div>
                    {question.options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleOptionClick(index)}
                            onMouseEnter={() => !showFeedback && setHoveredOption(index)}
                            onMouseLeave={() => setHoveredOption(null)}
                            style={getOptionStyle(index)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{
                                    fontWeight: '700',
                                    fontSize: '1.1rem',
                                    minWidth: '24px'
                                }}>
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                <span>{option}</span>
                                {showFeedback && index === question.correctAnswer && (
                                    <span style={{ marginLeft: 'auto', fontSize: '1.25rem' }}>✓</span>
                                )}
                                {showFeedback && index === selectedAnswer && index !== question.correctAnswer && (
                                    <span style={{ marginLeft: 'auto', fontSize: '1.25rem' }}>✗</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Explanation (shown after answer) */}
            {showFeedback && (
                <div style={{
                    backgroundColor: selectedAnswer === question.correctAnswer ? '#d4edda' : '#fff3cd',
                    border: `2px solid ${selectedAnswer === question.correctAnswer ? '#28a745' : '#ffc107'}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    animation: 'slideIn 0.4s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>
                            {selectedAnswer === question.correctAnswer ? '🎉' : '💡'}
                        </span>
                        <div>
                            <h4 style={{
                                margin: '0 0 0.5rem 0',
                                color: selectedAnswer === question.correctAnswer ? '#155724' : '#856404',
                                fontSize: '1rem',
                                fontWeight: '700'
                            }}>
                                {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Not quite!'}
                            </h4>
                            <p style={{
                                margin: 0,
                                color: selectedAnswer === question.correctAnswer ? '#155724' : '#856404',
                                lineHeight: '1.6'
                            }}>
                                {question.explanation}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

QuizQuestion.propTypes = {
    question: PropTypes.shape({
        id: PropTypes.string.isRequired,
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        correctAnswer: PropTypes.number.isRequired,
        explanation: PropTypes.string.isRequired
    }).isRequired,
    questionNumber: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    onAnswer: PropTypes.func.isRequired,
    selectedAnswer: PropTypes.number,
    showFeedback: PropTypes.bool.isRequired
};
