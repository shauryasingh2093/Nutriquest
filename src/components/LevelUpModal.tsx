import React, { useEffect, useState } from 'react';

interface LevelUpModalProps {
    level: number;
    onClose: () => void;
}

interface ConfettiPiece {
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
    const [showConfetti] = useState(true);

    useEffect(() => {
        if (!document.querySelector('style[data-level-up-modal]')) {
            const styleSheet = document.createElement("style");
            styleSheet.setAttribute('data-level-up-modal', 'true');
            styleSheet.textContent = `
                @keyframes scaleIn {
                    0% {
                        transform: scale(0.5);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
                
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }

        // Auto-close after 4 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={styles.overlay}>
            {showConfetti && <Confetti />}
            <div style={styles.modal}>
                <div style={styles.content}>
                    <div style={styles.badge}>
                        <div style={styles.badgeInner}>
                            <span style={styles.level}>{level}</span>
                        </div>
                    </div>
                    <h2 style={styles.title}>Level Up!</h2>
                    <p style={styles.subtitle}>You've reached Level {level}</p>
                    <div style={styles.mascot}>🐿️</div>
                    <p style={styles.message}>
                        Amazing progress! Keep learning to unlock more content!
                    </p>
                    <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                        Continue Learning
                    </button>
                </div>
            </div>
        </div>
    );
};

const Confetti: React.FC = () => {
    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)]
    }));

    return (
        <div style={styles.confettiContainer}>
            {pieces.map(piece => (
                <div
                    key={piece.id}
                    style={{
                        ...styles.confettiPiece,
                        left: `${piece.left}%`,
                        backgroundColor: piece.color,
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`
                    }}
                />
            ))}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease'
    },
    modal: {
        backgroundColor: 'white', // Changed from var(--color-white) for safety, though var might still work
        borderRadius: '24px',
        padding: '3rem 2rem',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    content: {
        position: 'relative',
        zIndex: 1
    },
    badge: {
        width: '120px',
        height: '120px',
        margin: '0 auto 1.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        animation: 'pulse 2s infinite'
    },
    badgeInner: {
        width: '100px',
        height: '100px',
        backgroundColor: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    level: {
        fontSize: '3rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '800',
        margin: '0 0 0.5rem 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: '1.25rem',
        color: '#666', // Changed from var(--color-text-secondary)
        margin: '0 0 1rem 0'
    },
    mascot: {
        fontSize: '4rem',
        margin: '1rem 0',
        animation: 'bounce 1s infinite'
    },
    message: {
        fontSize: '1.0625rem',
        color: '#666', // Changed from var(--color-text-secondary)
        lineHeight: '1.6',
        margin: 0
    },
    confettiContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden'
    },
    confettiPiece: {
        position: 'absolute',
        width: '10px',
        height: '10px',
        top: '-10px',
        animation: 'confettiFall 3s linear forwards',
        opacity: 0.8
    }
};

export default LevelUpModal;
