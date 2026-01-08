import React from 'react';

interface QuizDifficultyProps {
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface DifficultyConfig {
    acorns: number;
    color: string;
    label: string;
    xp: number;
}

const QuizDifficulty: React.FC<QuizDifficultyProps> = ({ difficulty }) => {
    const config: Record<'Easy' | 'Medium' | 'Hard', DifficultyConfig> = {
        Easy: { acorns: 1, color: '#8BC34A', label: 'Easy', xp: 10 },
        Medium: { acorns: 2, color: '#FF9800', label: 'Medium', xp: 20 },
        Hard: { acorns: 3, color: '#F44336', label: 'Hard', xp: 30 }
    };

    const { acorns, color, label, xp } = config[difficulty] || config.Easy;

    return (
        <div style={{ ...styles.container, borderColor: color }}>
            <div style={styles.acorns}>
                {Array.from({ length: acorns }).map((_, i) => (
                    <img key={i} src="/acron.png" alt="acorn" style={styles.acorn} />
                ))}
            </div>
            <span style={{ ...styles.label, color }}>{label}</span>
            <span style={styles.xp}>+{xp} XP</span>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        border: '2px solid',
        backgroundColor: 'rgba(255,255,255,0.9)',
        fontSize: '0.875rem'
    },
    acorns: {
        display: 'flex',
        gap: '2px'
    },
    acorn: {
        width: '16px',
        height: '16px'
    },
    label: {
        fontWeight: '700'
    },
    xp: {
        fontSize: '0.75rem',
        color: '#8B4513',
        fontWeight: '600'
    }
};

export default QuizDifficulty;
