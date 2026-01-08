import React from 'react';
import { StageProgress } from '../types';

interface StageIndicatorProps {
    currentStage: 'read' | 'practice' | 'notes';
    completedStages: StageProgress;
}

const StageIndicator: React.FC<StageIndicatorProps> = ({ currentStage, completedStages }) => {
    const stages: (keyof StageProgress)[] = ['read', 'practice', 'notes'];
    const stageLabels: Record<keyof StageProgress, string> = {
        read: 'READ',
        practice: 'QUIZ',
        notes: 'NOTES'
    };

    return (
        <div style={styles.container}>
            {stages.map((stage, index) => {
                const isCompleted = completedStages[stage];
                const isCurrent = currentStage === stage;
                const isLocked = !isCompleted && !isCurrent;

                return (
                    <div key={stage} style={styles.stageWrapper}>
                        <div style={styles.stoneWrapper}>
                            {/* Stone Asset for indicator */}
                            <img
                                src="/stone.png"
                                alt="stage stone"
                                style={{
                                    ...styles.stoneImage,
                                    opacity: isLocked ? 0.6 : 1,
                                    filter: isLocked ? 'grayscale(1)' : isCompleted ? 'drop-shadow(0 0 8px #8BC34A)' : 'none',
                                    transform: isCurrent ? 'scale(1.2)' : 'scale(1)'
                                }}
                            />

                            {/* Inner mark or number */}
                            <div style={{
                                ...styles.mark,
                                opacity: isLocked ? 0.6 : 1,
                                color: isCompleted ? '#2E7D32' : isCurrent ? '#8B4513' : '#666'
                            }}>
                                {isCompleted ? '✓' : index + 1}
                            </div>
                        </div>

                        <div style={{
                            ...styles.label,
                            color: isCompleted ? '#2E7D32' : isCurrent ? '#8B4513' : '#999',
                            fontWeight: isCurrent ? '800' : '600',
                            opacity: isLocked ? 0.6 : 1
                        }}>
                            {stageLabels[stage]}
                        </div>

                        {index < stages.length - 1 && (
                            <div style={{
                                ...styles.connector,
                                backgroundColor: isCompleted ? '#8BC34A' : '#D7CCC8'
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 0',
        gap: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '16px',
        margin: '0 2rem 1.5rem 2rem',
        border: '1px solid rgba(222, 184, 135, 0.3)'
    },
    stageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '80px'
    },
    stoneWrapper: {
        position: 'relative',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    stoneImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transition: 'all 0.3s ease',
        zIndex: 1
    },
    mark: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '1.25rem',
        fontWeight: '900',
        zIndex: 2,
        pointerEvents: 'none'
    },
    label: {
        marginTop: '0.25rem',
        fontSize: '0.65rem',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        transition: 'all 0.3s ease'
    },
    connector: {
        position: 'absolute',
        top: '30px',
        left: '70px',
        width: '40px',
        height: '3px',
        borderRadius: '2px',
        transition: 'background-color 0.5s ease',
        zIndex: 0
    }
};

export default StageIndicator;
