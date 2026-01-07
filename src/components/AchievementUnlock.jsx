import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function AchievementUnlock({ achievement, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slide in
        setTimeout(() => setIsVisible(true), 100);

        // Auto-dismiss after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={{
            ...styles.container,
            transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
            opacity: isVisible ? 1 : 0
        }}>
            <div style={styles.icon}>{achievement.icon}</div>
            <div style={styles.content}>
                <div style={styles.label}>Achievement Unlocked!</div>
                <div style={styles.name}>{achievement.name}</div>
                {achievement.description && (
                    <div style={styles.description}>{achievement.description}</div>
                )}
            </div>
            <button onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }} style={styles.closeButton}>
                ✕
            </button>
        </div>
    );
}

const styles = {
    container: {
        position: 'fixed',
        top: '100px',
        right: '20px',
        backgroundColor: 'var(--color-white)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '400px',
        zIndex: 1500,
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        border: '2px solid #FFD700'
    },
    icon: {
        fontSize: '3rem',
        flexShrink: 0
    },
    content: {
        flex: 1
    },
    label: {
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        color: '#FFD700',
        marginBottom: '0.25rem',
        letterSpacing: '0.5px'
    },
    name: {
        fontSize: '1.125rem',
        fontWeight: '700',
        color: 'var(--color-text-primary)',
        marginBottom: '0.25rem'
    },
    description: {
        fontSize: '0.875rem',
        color: 'var(--color-text-secondary)',
        lineHeight: '1.4'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.25rem',
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
        padding: '0.25rem',
        flexShrink: 0,
        transition: 'color 0.2s ease'
    }
};

AchievementUnlock.propTypes = {
    achievement: PropTypes.shape({
        icon: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string
    }).isRequired,
    onClose: PropTypes.func.isRequired
};
