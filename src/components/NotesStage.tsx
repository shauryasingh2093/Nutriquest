import React from 'react';

interface NotesStageProps {
    summary: string;
    keyTakeaways: string[];
    onComplete: () => void;
}

const NotesStage: React.FC<NotesStageProps> = ({ summary, keyTakeaways, onComplete }) => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.icon}>📝</span>
                <h3 style={styles.title}>Key Takeaways</h3>
            </div>

            <div style={styles.summary}>
                <p style={styles.summaryText}>{summary}</p>
            </div>

            <div style={styles.takeaways}>
                <h4 style={styles.takeawaysTitle}>Remember:</h4>
                <ul style={styles.list}>
                    {keyTakeaways.map((takeaway, index) => (
                        <li key={index} style={styles.listItem}>
                            <span style={styles.bullet}>✓</span>
                            {takeaway}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={styles.notesSection}>
                <h4 style={styles.notesTitle}>Your Notes (Optional)</h4>
                <textarea
                    style={styles.textarea}
                    placeholder="Write down your thoughts, questions, or anything you want to remember..."
                    rows={4}
                />
            </div>

            <button onClick={onComplete} style={styles.button}>
                Complete Stage & Earn 10 XP! 🎯
            </button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '700px',
        margin: '0 auto',
        padding: '2rem'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem'
    },
    icon: {
        fontSize: '4rem',
        display: 'block',
        marginBottom: '1rem'
    },
    title: {
        fontSize: '2rem',
        color: '#8B4513',
        margin: 0
    },
    summary: {
        backgroundColor: '#FFF8DC',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '2px solid #DEB887'
    },
    summaryText: {
        fontSize: '1.125rem',
        lineHeight: '1.8' as any, // React.CSSProperties uses string | number, but sometimes TS is picky with line-height
        color: '#5D4037',
        margin: 0
    },
    takeaways: {
        backgroundColor: '#E8F5E9',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '2px solid #8BC34A'
    },
    takeawaysTitle: {
        fontSize: '1.25rem',
        color: '#2E7D32',
        marginTop: 0,
        marginBottom: '1rem'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    listItem: {
        fontSize: '1rem',
        lineHeight: '1.8' as any,
        color: '#5D4037',
        marginBottom: '0.75rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start'
    },
    bullet: {
        color: '#8BC34A',
        fontWeight: '700',
        fontSize: '1.25rem',
        flexShrink: 0
    },
    notesSection: {
        marginBottom: '2rem'
    },
    notesTitle: {
        fontSize: '1.125rem',
        color: '#8B4513',
        marginBottom: '0.75rem'
    },
    textarea: {
        width: '100%',
        padding: '1rem',
        borderRadius: '8px',
        border: '2px solid #DEB887',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        backgroundColor: 'white'
    },
    button: {
        width: '100%',
        padding: '1rem 2rem',
        backgroundColor: '#8B4513',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        fontSize: '1.125rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)'
    }
};

export default NotesStage;
