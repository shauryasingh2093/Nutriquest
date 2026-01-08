import React, { useEffect } from 'react';

interface SteppingStoneProps {
    stage: 'read' | 'practice' | 'notes';
    isCompleted?: boolean;
    isActive?: boolean;
    isLocked?: boolean;
    onClick?: () => void;
}

const SteppingStone: React.FC<SteppingStoneProps> = ({
    stage,
    isCompleted = false,
    isActive = false,
    isLocked = false,
    onClick = () => { }
}) => {
    const stageLabels: Record<'read' | 'practice' | 'notes', string> = {
        read: 'READ',
        practice: 'QUIZ',
        notes: 'NOTES'
    };

    useEffect(() => {
        if (!document.querySelector('style[data-stepping-stone]')) {
            const styleSheet = document.createElement("style");
            styleSheet.setAttribute('data-stepping-stone', 'true');
            styleSheet.textContent = `
                @keyframes glowPulse {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(255, 213, 79, 0.6), 0 4px 12px rgba(0,0,0,0.2);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(255, 213, 79, 0.9), 0 4px 12px rgba(0,0,0,0.2);
                    }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
                    50% { opacity: 0.5; transform: scale(1.2) rotate(180deg); }
                }

                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
                    50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }, []);

    return (
        <div
            onClick={!isLocked ? onClick : undefined}
            style={{
                ...styles.container,
                opacity: isLocked ? 0.6 : 1,
                filter: isLocked ? 'grayscale(1)' : 'none',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
            }}
        >
            {/* Stone Asset */}
            <img
                src="/stone.png"
                alt="Stone Stage"
                style={{
                    ...styles.stoneImage,
                    filter: isCompleted ? 'drop-shadow(0 0 8px #8BC34A)' : 'none'
                }}
            />

            {/* Label Overlay */}
            {!isLocked && (
                <div style={styles.labelContainer}>
                    <div style={{
                        ...styles.label,
                        color: isCompleted ? '#2E7D32' : '#5D4037',
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                    }}>
                        {isCompleted ? 'DONE' : stageLabels[stage]}
                    </div>
                </div>
            )}

            {/* Glow effect for active */}
            {isActive && !isCompleted && (
                <div style={styles.glow} />
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'relative',
        width: '140px',
        height: '140px',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '-15px 0' // Slight overlap for tighter trail
    },
    stoneImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        zIndex: 1
    },
    labelContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '900',
        padding: '4px 10px',
        borderRadius: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap'
    },
    glow: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 213, 79, 0.4)',
        animation: 'pulse 2s infinite',
        zIndex: 0
    }
};

export default SteppingStone;
