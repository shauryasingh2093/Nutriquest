import React, { useEffect, useState } from 'react';

interface MascotCharacterProps {
    position: {
        isMoving?: boolean;
        x: number;
        y: number;
        type?: string;
    };
    expression?: 'happy' | 'celebrating' | 'encouraging' | 'thinking' | 'neutral';
    message?: string;
}

const MascotCharacter: React.FC<MascotCharacterProps> = ({
    position = { isMoving: false, x: 50, y: 0 },
    expression = 'neutral',
    message = ''
}) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div style={{
            ...styles.container,
            animation: position.isMoving ? 'mascotBounce 0.8s ease-out' : 'none'
        }}>
            {/* Mascot Image */}
            <div style={styles.mascotWrapper}>
                <img
                    src="/mascot_game.png"
                    alt="Mascot"
                    style={{
                        ...styles.mascot,
                        filter: position.isMoving ? 'drop-shadow(0 0 15px #FFD54F)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                    } as React.CSSProperties}
                />
            </div>

            {/* Speech Bubble */}
            {showMessage && message && (
                <div style={styles.speechBubble}>
                    {message}
                    <div style={styles.speechTail} />
                </div>
            )}

            {/* Movement trail (simple white circles) */}
            {position.isMoving && (
                <div style={styles.dustContainer}>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.dustCircle,
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        position: 'relative',
        display: 'inline-block'
    },
    mascotWrapper: {
        position: 'relative',
        width: '80px',
        height: '80px'
    },
    mascot: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transition: 'filter 0.3s ease'
    },
    speechBubble: {
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '0.875rem',
        fontWeight: '900',
        color: '#5D4037',
        whiteSpace: 'nowrap',
        zIndex: 10,
        border: '2px solid #8B4513'
    },
    speechTail: {
        position: 'absolute',
        bottom: '-8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid white'
    },
    dustContainer: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)'
    },
    dustCircle: {
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        animation: 'dustFloat 0.8s ease-out forwards',
        opacity: 0
    }
};

// Add keyframes
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes mascotBounce {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-20px); }
            50% { transform: translateY(-10px); }
            75% { transform: translateY(-15px); }
        }
        
        @keyframes dustFloat {
            0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(calc(var(--x, 0) * 20px), -30px) scale(0.5);
            }
        }
    `;
    if (!document.querySelector('style[data-mascot]')) {
        styleSheet.setAttribute('data-mascot', 'true');
        document.head.appendChild(styleSheet);
    }
}

export default MascotCharacter;
