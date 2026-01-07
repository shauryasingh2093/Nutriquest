import PropTypes from 'prop-types';

export default function LevelStump({ levelNumber, lessonTitle, totalXP, isCompleted, isUnlocked }) {
    return (
        <div style={{
            ...styles.container,
            opacity: isUnlocked ? 1 : 0.6,
            filter: isUnlocked ? 'none' : 'grayscale(1)'
        }}>
            {/* Tree Stump Base */}
            <div style={styles.stumpContainer}>
                <img
                    src="/tree.png"
                    alt="Tree Stump"
                    style={styles.stumpImage}
                />

                {/* Small Acorn on the stump */}
                <img
                    src="/acron.png"
                    alt="Acorn Deco"
                    style={styles.acornOnStump}
                />
            </div>

            {/* Board Sign to the right */}
            <div style={styles.boardContainer}>
                <img
                    src="/board.png"
                    alt="Level Board"
                    style={styles.boardImage}
                />

                {/* Content on Board */}
                <div style={styles.content}>
                    {levelNumber === 0 ? (
                        <div style={styles.startTitle}>START</div>
                    ) : (
                        <>
                            <div style={styles.levelLabel}>LEVEL {levelNumber}</div>
                            <div style={styles.lessonTitle}>{lessonTitle}</div>
                            <div style={styles.xpBox}>
                                <img src="/star.png" alt="XP Star" style={styles.starIcon} />
                                <span style={styles.xpText}>+{totalXP} XP</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Completion indicator */}
            {isCompleted && (
                <div style={styles.completeBadge}>{levelNumber === 0 ? 'STARTED' : 'DONE'}</div>
            )}
        </div>
    );
}

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '15px',
        width: '380px',
        height: '180px',
        margin: '20px auto',
        transition: 'all 0.3s ease'
    },
    stumpContainer: {
        position: 'relative',
        width: '150px',
        height: '150px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    stumpImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        zIndex: 1
    },
    acornOnStump: {
        position: 'absolute',
        top: '10px', // Keeping original top as no specific offset value was provided in the snippet
        width: '40px',
        height: '40px',
        zIndex: 2,
        animation: 'float 3s ease-in-out infinite'
    },
    boardContainer: {
        position: 'relative',
        width: '180px',
        height: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    boardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    },
    content: {
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    levelLabel: {
        fontSize: '1.25rem',
        fontWeight: '900',
        color: 'white',
        textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
        marginBottom: '4px'
    },
    lessonTitle: {
        fontSize: '0.8rem',
        fontWeight: '700',
        color: 'white',
        textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
        lineHeight: 1.2,
        marginBottom: '8px',
        maxWidth: '100%'
    },
    xpBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    starIcon: {
        width: '24px',
        height: '24px',
        filter: 'drop-shadow(0 0 5px #FFEB3B)'
    },
    xpText: {
        fontSize: '1rem',
        fontWeight: '900',
        color: '#212121',
        fontFamily: 'serif'
    },
    completeBadge: {
        position: 'absolute',
        top: '0',
        right: '10px',
        backgroundColor: '#8BC34A',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '900',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 10,
        border: '2px solid white'
    }
};

// Add keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes popIn {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
if (!document.querySelector('style[data-level-stump]')) {
    styleSheet.setAttribute('data-level-stump', 'true');
    document.head.appendChild(styleSheet);
}

LevelStump.propTypes = {
    levelNumber: PropTypes.number.isRequired,
    totalXP: PropTypes.number.isRequired,
    isCompleted: PropTypes.bool,
    isUnlocked: PropTypes.bool
};

LevelStump.defaultProps = {
    isCompleted: false,
    isUnlocked: false
};
