import React, { useEffect, useState } from 'react';

interface XPBurstProps {
    xp: number;
    onComplete: () => void;
}

interface Particle {
    id: number;
    angle: number;
    distance: number;
    delay: number;
}

const XPBurst: React.FC<XPBurstProps> = ({ xp, onComplete }) => {
    const [count, setCount] = useState(0);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const styleId = 'xp-burst-animations';
            if (!document.getElementById(styleId)) {
                const styleSheet = document.createElement("style");
                styleSheet.id = styleId;
                styleSheet.textContent = `
                    @keyframes floatUpStar {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0) translateY(0); }
                        20% { opacity: 1; transform: translate(-50%, -50%) scale(1) translateY(-20px); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5) translateY(-150px); }
                    }
                    @keyframes scaleAndFloat {
                        0% { transform: scale(0) translateY(0); opacity: 0; }
                        30% { transform: scale(1.2) translateY(-20px); opacity: 1; }
                        100% { transform: scale(1) translateY(-100px); opacity: 0; }
                    }
                    @keyframes spinAndGrow {
                        0% { transform: rotate(0deg) scale(0); opacity: 0; }
                        50% { transform: rotate(360deg) scale(1.2); opacity: 1; }
                        100% { transform: rotate(720deg) scale(1) translateY(-100px); opacity: 0; }
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.3); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `;
                document.head.appendChild(styleSheet);
            }
        }

        // Generate particles
        const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            angle: (i * (360 / 15)) * (Math.PI / 180),
            distance: 80 + Math.random() * 60,
            delay: Math.random() * 0.3
        }));
        setParticles(newParticles);

        // Count up animation
        const duration = 800;
        const steps = 20;
        const increment = xp / steps;
        let current = 0;

        const interval = setInterval(() => {
            current += increment;
            if (current >= xp) {
                setCount(xp);
                clearInterval(interval);
                setTimeout(onComplete, 1200); // Give time for float animation
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(interval);
    }, [xp, onComplete]);

    return (
        <div style={styles.container}>
            {/* Floating Particles */}
            {particles.map(particle => (
                <img
                    key={particle.id}
                    src="/nut.png"
                    alt="particle"
                    style={{
                        ...styles.particle,
                        left: `${50 + Math.cos(particle.angle) * particle.distance}%`,
                        top: `${50 + Math.sin(particle.angle) * particle.distance}%`,
                        animationDelay: `${particle.delay}s`,
                        width: '30px',
                        height: '30px'
                    }}
                />
            ))}

            {/* XP Number */}
            <div style={styles.xpNumber}>
                +{count} XP
            </div>

            {/* Nut icon */}
            <img src="/nut.png" alt="XP" style={styles.nut} />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2000,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    particle: {
        position: 'absolute',
        fontSize: '1.5rem',
        animation: 'floatUpStar 1.5s ease-out forwards',
        opacity: 0
    },
    xpNumber: {
        fontSize: '4.5rem',
        fontWeight: '900',
        color: '#FFD700',
        textShadow: '0 4px 15px rgba(0,0,0,0.4)',
        animation: 'scaleAndFloat 1.2s ease-out forwards',
        textAlign: 'center',
        position: 'relative'
    },
    sparkle: {
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        fontSize: '2rem',
        animation: 'pulse 1s infinite'
    },
    nut: {
        width: '80px',
        height: '80px',
        animation: 'spinAndGrow 1s ease-out forwards',
        marginTop: '20px'
    }
};

export default XPBurst;
