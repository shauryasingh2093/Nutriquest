import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StageIndicator from '../components/StageIndicator';
import QuizDifficulty from '../components/QuizDifficulty';
import NotesStage from '../components/NotesStage';
import XPBurst from '../components/XPBurst';
import LevelUpModal from '../components/LevelUpModal';
import AchievementUnlock from '../components/AchievementUnlock';
import SteppingStone from '../components/SteppingStone';
import LevelStump from '../components/LevelStump';
import MascotCharacter from '../components/MascotCharacter';
import LoadingScreen from '../components/LoadingScreen';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Course, Lesson, Achievement, StageProgress } from '../types';

interface MascotPos {
    x: number;
    y: number;
    isMoving?: boolean;
    type?: string;
}

const Roadmap: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [currentStage, setCurrentStage] = useState<'read' | 'practice' | 'notes'>('read');
    const [stageProgress, setStageProgress] = useState<Record<string, StageProgress>>({});
    const [lessonContent, setLessonContent] = useState<Lesson | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showXPBurst, setShowXPBurst] = useState(false);
    const [earnedXP, setEarnedXP] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [mascotPos, setMascotPos] = useState<MascotPos>({ x: 50, y: 40, isMoving: false });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, updateUser, addToHistory } = useAuth();

    useEffect(() => {
        if (courseId) {
            fetchCourseData();
            // Add to history via AuthContext (persists to DB)
            addToHistory(courseId);
        }
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            const courseRes = await api.get(`/courses/${courseId}`);
            setCourse(courseRes.data.course);
            setLessons(courseRes.data.course.lessons);

            if (user?.stageProgress) {
                setStageProgress(user.stageProgress);
            }

            const firstUnlockedIndex = courseRes.data.course.lessons.findIndex((_: any, idx: number) =>
                isLessonUnlockedByIndex(idx, user?.stageProgress || {}, courseRes.data.course.lessons)
            );

            let targetIndex = firstUnlockedIndex >= 0 ? firstUnlockedIndex : 0;
            for (let i = 0; i < courseRes.data.course.lessons.length; i++) {
                const key = `${courseId}-${courseRes.data.course.lessons[i].id}`;
                const prog = (user?.stageProgress || {})[key] || {};
                if (!(prog.read && prog.practice && prog.notes)) {
                    targetIndex = i;
                    break;
                }
            }

            setCurrentLessonIndex(targetIndex);
            if (courseRes.data.course.lessons.length > 0) {
                await fetchLessonContent(courseRes.data.course.lessons[targetIndex].id, user?.stageProgress || {});
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const isLessonUnlockedByIndex = (index: number, progress: Record<string, StageProgress>, lessonsList: Lesson[]) => {
        if (index === 0) return true;
        const prevLesson = lessonsList[index - 1];
        if (!prevLesson) return false;
        const key = `${courseId}-${prevLesson.id}`;
        const prevProgress = progress[key] || {};
        return prevProgress.read && prevProgress.practice && prevProgress.notes;
    };

    const fetchLessonContent = async (lessonId: string, currentProg = stageProgress) => {
        try {
            const response = await api.get(`/lessons/${courseId}/${lessonId}`);
            setLessonContent(response.data.lesson);

            const lessonKey = `${courseId}-${lessonId}`;
            const progress = currentProg[lessonKey] || { read: false, practice: false, notes: false };

            if (!progress.read) setCurrentStage('read');
            else if (!progress.practice) setCurrentStage('practice');
            else if (!progress.notes) setCurrentStage('notes');
            else setCurrentStage('read');
        } catch (error) {
            console.error('Error fetching lesson:', error);
        }
    };

    const handleStoneClick = async (lesson: Lesson, lessonIndex: number, stage: 'read' | 'practice' | 'notes') => {
        if (!isLessonUnlocked(lessonIndex)) return;

        const progress = getStageCompletion(lesson.id);
        const stageIndex = ['read', 'practice', 'notes'].indexOf(stage);

        if (stageIndex > 0) {
            const prevStage = ['read', 'practice', 'notes'][stageIndex - 1] as 'read' | 'practice' | 'notes';
            if (!progress[prevStage]) return;
        }

        setCurrentLessonIndex(lessonIndex);
        setCurrentStage(stage);
        setCurrentQuestion(0);
        setAnswers([]);
        setShowFeedback(false);
        await fetchLessonContent(lesson.id);
    };

    const handleCompleteStage = async (stage: 'read' | 'practice' | 'notes', xp: number, content?: string) => {
        const lessonId = lessons[currentLessonIndex].id;

        try {
            const response = await api.post('/progress/complete-stage', {
                courseId,
                lessonId,
                stage,
                xp,
                content
            });

            updateUser(response.data.user);
            setStageProgress(response.data.user.stageProgress || {});

            setEarnedXP(xp);
            setShowXPBurst(true);

            if (response.data.leveledUp) {
                setTimeout(() => setShowLevelUp(true), 1500);
            }

            if (response.data.newAchievements?.length > 0) {
                setAchievements(response.data.newAchievements);
            }

            if (response.data.allStagesComplete) {
                setTimeout(() => {
                    if (currentLessonIndex < lessons.length - 1) {
                        const nextIndex = currentLessonIndex + 1;
                        setCurrentLessonIndex(nextIndex);
                        setCurrentStage('read');
                        fetchLessonContent(lessons[nextIndex].id, response.data.user.stageProgress);
                        setCurrentQuestion(0);
                        setAnswers([]);
                        setShowFeedback(false);
                    }
                }, 2000);
            } else {
                if (stage === 'read') setCurrentStage('practice');
                else if (stage === 'practice') setCurrentStage('notes');
            }
        } catch (error) {
            console.error('Error completing stage:', error);
        }
    };

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
        setShowFeedback(true);
    };

    const handleNextQuestion = () => {
        if (lessonContent?.stages?.practice && currentQuestion < lessonContent.stages.practice.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowFeedback(false);
        } else if (lessonContent?.stages?.practice) {
            const totalXP = lessonContent.stages.practice.questions.reduce((sum, q, i) => {
                return answers[i] === q.correctAnswer ? sum + q.xpReward : sum;
            }, 0);
            handleCompleteStage('practice', totalXP);
        }
    };

    const getLessonKey = (lessonId: string) => `${courseId}-${lessonId}`;

    const calculatePath = (count: number) => {
        const path: MascotPos[] = [];
        const baseCenter = 50;
        const offset = 20;
        const verticalSpacing = 400;

        path.push({ x: 50, y: 40, type: 'start' });

        for (let i = 0; i < count; i++) {
            const isLeft = i % 2 === 0;
            const baseY = (i * verticalSpacing) + 120;

            if (isLeft) {
                path.push({ x: baseCenter - (offset * 1.5), y: baseY, type: 'stone' });
                path.push({ x: baseCenter - (offset * 0.5), y: baseY + 80, type: 'stone' });
                path.push({ x: baseCenter + (offset * 0.5), y: baseY + 160, type: 'stone' });
            } else {
                path.push({ x: baseCenter + (offset * 1.5), y: baseY, type: 'stone' });
                path.push({ x: baseCenter + (offset * 0.5), y: baseY + 80, type: 'stone' });
                path.push({ x: baseCenter - (offset * 0.5), y: baseY + 160, type: 'stone' });
            }
            path.push({ x: 50, y: baseY + 280, type: 'stump' });
        }
        return path;
    };

    useEffect(() => {
        if (lessons.length > 0) {
            const levelIdx = currentLessonIndex;
            const stageIdx = ['read', 'practice', 'notes'].indexOf(currentStage);
            const path = calculatePath(lessons.length);

            const levelKey = getLessonKey(lessons[levelIdx].id);
            const progress = stageProgress[levelKey] || { read: false, practice: false, notes: false };

            let targetPosIndex = 0;

            if (levelIdx === 0 && !progress.read && currentStage === 'read') {
                targetPosIndex = 0;
            } else {
                targetPosIndex = levelIdx * 4 + stageIdx + 1;
            }

            const targetPos = path[targetPosIndex];
            if (targetPos) {
                setMascotPos({ ...targetPos, isMoving: true });
                setTimeout(() => setMascotPos(prev => ({ ...prev, isMoving: false })), 800);
            }
        }
    }, [currentLessonIndex, currentStage, lessons, stageProgress]);

    useEffect(() => {
        if (!loading && mascotPos.y !== 0) {
            const container = document.getElementById('roadmap-scroll-container');
            const mascotElem = document.getElementById('mascot-character');
            if (container && mascotElem) {
                const containerHeight = container.offsetHeight;
                const mascotTop = mascotElem.offsetTop;
                container.scrollTo({
                    top: mascotTop - (containerHeight / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [mascotPos.y, loading]);

    const getStageCompletion = (lessonId: string): StageProgress => {
        const key = getLessonKey(lessonId);
        return stageProgress[key] || { read: false, practice: false, notes: false };
    };

    const isLessonUnlocked = (index: number): boolean => {
        if (index === 0) return true;
        const prevLesson = lessons[index - 1];
        if (!prevLesson) return false;
        const prevProgress = getStageCompletion(prevLesson.id);
        return !!(prevProgress.read && prevProgress.practice && prevProgress.notes);
    };

    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading || !course) {
            timer = setTimeout(() => setShowLoading(true), 500);
        } else {
            setShowLoading(false);
        }
        return () => clearTimeout(timer);
    }, [loading, course]);

    if (loading || !course) {
        if (!showLoading) return null;
        return <LoadingScreen message="Unlocking your learning path..." />;
    }

    const currentLesson = lessons[currentLessonIndex];
    const currentProgress = getStageCompletion(currentLesson?.id);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAF3E0' }}>
            <Navbar />
            <div style={styles.container}>
                {/* Left Content Panel */}
                <div style={styles.leftPanel}>
                    <div style={styles.header}>
                        <h1 style={styles.courseTitle}>{course.title} &lt;/&gt;</h1>
                    </div>

                    <div style={styles.content}>
                        {!lessonContent ? (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                <img src="/mascot_game.png" alt="Mascot" style={{ width: '150px', marginBottom: '2rem' }} />
                                <h2 style={{ color: '#8B4513', marginBottom: '1rem' }}>Welcome to {course.title}!</h2>
                                <p style={{ color: '#8D6E63', fontSize: '1.125rem' }}>Click on the START stump or an unlocked stone to begin your journey!</p>
                            </div>
                        ) : (
                            <div className="lesson-container">
                                <StageIndicator
                                    currentStage={currentStage}
                                    completedStages={currentProgress}
                                />

                                {currentStage === 'read' && lessonContent.stages?.read && (
                                    <div style={styles.lessonContent}>
                                        <h2 style={{ fontSize: '1.75rem', color: '#8B4513', marginBottom: '1.5rem' }}>{lessonContent.title}</h2>
                                        <p style={styles.intro}>{lessonContent.stages.read.introduction}</p>
                                        {lessonContent.stages.read.sections.map((section, index) => (
                                            <div key={index} style={{ marginBottom: '2rem' }}>
                                                <h3 style={styles.sectionTitle}>{section.title}</h3>
                                                <p style={styles.sectionContent}>{section.content}</p>
                                                {section.keyPoints && (
                                                    <div style={styles.keyPointsBox}>
                                                        <h4 style={styles.keyPointsTitle}>Key Points:</h4>
                                                        <ul style={styles.list}>
                                                            {section.keyPoints.map((point, i) => (
                                                                <li key={i} style={styles.listItem}>{point}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {section.example && (
                                                    <div style={styles.exampleBox}>
                                                        <h4 style={styles.exampleTitle}>💡 Example:</h4>
                                                        <pre style={styles.codeBlock}><code>{section.example.code}</code></pre>
                                                        <p style={styles.exampleExplanation}>{section.example.explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <div style={styles.footer}>
                                            <button
                                                onClick={() => handleCompleteStage('read', lessonContent.stages!.read!.xp)}
                                                style={styles.nextButton}
                                            >
                                                Complete Reading (+{lessonContent.stages.read.xp} XP) →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {currentStage === 'practice' && lessonContent.stages?.practice && (
                                    <div style={styles.lessonContent}>
                                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                            <h3 style={styles.quizTitle}>Practice Questions</h3>
                                            <p style={styles.quizSubtitle}>Question {currentQuestion + 1} of {lessonContent.stages.practice.questions.length}</p>
                                        </div>
                                        {(() => {
                                            const question = lessonContent.stages!.practice!.questions[currentQuestion];
                                            return (
                                                <>
                                                    <QuizDifficulty difficulty={question.difficulty} />
                                                    <div style={styles.questionBox}>
                                                        <h4 style={styles.questionText}>{question.question}</h4>
                                                        {question.options.map((option, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={() => !showFeedback && handleAnswer(index)}
                                                                style={{
                                                                    ...styles.option,
                                                                    backgroundColor: showFeedback ? (index === question.correctAnswer ? '#d4edda' : (index === answers[currentQuestion] ? '#f8d7da' : 'white')) : (answers[currentQuestion] === index ? '#e3f2fd' : 'white'),
                                                                    borderColor: showFeedback ? (index === question.correctAnswer ? '#28a745' : (index === answers[currentQuestion] ? '#dc3545' : '#ddd')) : (answers[currentQuestion] === index ? '#2196F3' : '#ddd'),
                                                                    cursor: showFeedback ? 'default' : 'pointer',
                                                                    transform: !showFeedback && answers[currentQuestion] === index ? 'scale(1.02)' : 'none'
                                                                } as React.CSSProperties}
                                                            >
                                                                {option}
                                                                {showFeedback && index === question.correctAnswer && <span style={{ marginLeft: 'auto', color: '#28a745', fontWeight: 'bold' }}>✓</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {showFeedback && (
                                                        <div style={styles.feedbackBox}>
                                                            <p style={{ margin: 0, lineHeight: '1.6' }}>{question.explanation}</p>
                                                        </div>
                                                    )}
                                                    <div style={styles.footer}>
                                                        {showFeedback && (
                                                            <button
                                                                onClick={handleNextQuestion}
                                                                style={styles.nextButton}
                                                            >
                                                                {currentQuestion < lessonContent.stages!.practice!.questions.length - 1 ? 'Next Question →' : 'Finish Practice →'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}

                                {currentStage === 'notes' && lessonContent.stages?.notes && (
                                    <div style={styles.lessonContent}>
                                        <NotesStage
                                            summary={lessonContent.stages.notes.summary}
                                            keyTakeaways={lessonContent.stages.notes.keyTakeaways}
                                            savedNotes={stageProgress[`${courseId}-${lessons[currentLessonIndex]?.id}`]?.userNotes || ''}
                                            onComplete={(note) => handleCompleteStage('notes', lessonContent.stages!.notes!.xp, note)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Roadmap Panel */}
                <div style={styles.rightPanel} id="roadmap-scroll-container">
                    <div style={{ ...styles.roadmapPath, height: `${(lessons.length + 1) * 400 + 300}px`, position: 'relative' }}>
                        {/* START area */}
                        <div style={{ position: 'absolute', bottom: '0px', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                            <LevelStump
                                levelNumber={0}
                                lessonTitle="START"
                                totalXP={0}
                                isUnlocked={true}
                                isCompleted={isLessonUnlocked(0)}
                            />
                        </div>

                        {lessons.map((lesson, lessonIndex) => {
                            const lessonProgress = getStageCompletion(lesson.id);
                            const isUnlocked = isLessonUnlocked(lessonIndex);
                            const isCurrentLesson = lessonIndex === currentLessonIndex;
                            const isCompleted = lessonProgress.read && lessonProgress.practice && lessonProgress.notes;
                            const path = calculatePath(lessons.length);

                            return (
                                <div key={lesson.id}>
                                    {/* Stages (Stepping Stones) */}
                                    {(['read', 'practice', 'notes'] as const).map((stage, stageIndex) => {
                                        const stageCompleted = lessonProgress[stage];
                                        const stageActive = isCurrentLesson && currentStage === stage;
                                        const stageLocked = !isUnlocked || (stageIndex > 0 && !lessonProgress[(['read', 'practice', 'notes'] as const)[stageIndex - 1]]);
                                        const pos = path[lessonIndex * 4 + stageIndex + 1];

                                        return (
                                            <div
                                                key={stage}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: `${pos.y}px`,
                                                    left: `${pos.x}%`,
                                                    transform: 'translateX(-50%)',
                                                    transition: 'all 0.5s ease',
                                                    zIndex: 2
                                                }}
                                            >
                                                <SteppingStone
                                                    stage={stage}
                                                    isCompleted={!!stageCompleted}
                                                    isActive={stageActive}
                                                    isLocked={!stageCompleted && !stageActive}
                                                    onClick={() => !stageLocked && handleStoneClick(lesson, lessonIndex, stage)}
                                                />
                                            </div>
                                        );
                                    })}

                                    {/* Level End Stump */}
                                    {(() => {
                                        const stumpPos = path[(lessonIndex + 1) * 4];
                                        return (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: `${stumpPos.y}px`,
                                                left: `${stumpPos.x}%`,
                                                transform: 'translateX(-50%)',
                                                zIndex: 3
                                            }}>
                                                <LevelStump
                                                    levelNumber={lessonIndex + 1}
                                                    lessonTitle={lesson.title}
                                                    totalXP={lesson.xp}
                                                    isCompleted={!!isCompleted}
                                                    isUnlocked={lessonIndex <= currentLessonIndex}
                                                />
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        })}

                        {/* Mascot Character */}
                        <div
                            id="mascot-character"
                            style={{
                                position: 'absolute',
                                bottom: `${mascotPos.y + (mascotPos.type === 'stone' ? 20 : 150)}px`,
                                left: `${mascotPos.x}%`,
                                transform: 'translateX(-50%)',
                                zIndex: 10,
                                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                        >
                            <MascotCharacter
                                position={mascotPos}
                                expression={mascotPos.isMoving ? 'celebrating' : 'happy'}
                                message={showXPBurst ? `+${earnedXP} XP!` : ""}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Overlays */}
            {showXPBurst && <XPBurst xp={earnedXP} onComplete={() => setShowXPBurst(false)} />}
            {showLevelUp && <LevelUpModal level={user?.level || 1} onClose={() => setShowLevelUp(false)} />}
            {achievements.map((achievement) => (
                <AchievementUnlock key={achievement.id} achievement={achievement} onClose={() => setAchievements(achievements.filter(a => a.id !== achievement.id))} />
            ))}
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { display: 'flex', flex: 1, backgroundColor: '#FAF3E0', overflow: 'hidden' },
    leftPanel: { flex: '0 0 55%', backgroundColor: '#FFF8DC', display: 'flex', flexDirection: 'column', borderRight: '3px solid #DEB887', overflowY: 'auto' },
    header: { padding: '1.5rem 2rem', borderBottom: '2px solid #DEB887' },
    courseTitle: { margin: '0 0 1rem 0', fontSize: '2rem', color: '#8B4513' },
    tabs: { display: 'flex', gap: '0.5rem' },
    tab: { padding: '0.5rem 1rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', color: '#8B4513', borderRadius: '8px 8px 0 0', transition: 'background-color 0.2s ease' },
    activeTab: { backgroundColor: '#F5DEB3', color: '#5D4037' },
    content: { flex: 1, padding: '2rem', overflowY: 'auto' },
    intro: { fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '2rem', color: '#5D4037' },
    sectionTitle: { fontSize: '1.5rem', color: '#8B4513', marginBottom: '1rem' },
    sectionContent: { fontSize: '1.0625rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#5D4037' },
    keyPointsBox: { backgroundColor: '#FFF8DC', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid #DEB887' },
    keyPointsTitle: { fontSize: '1.125rem', marginBottom: '0.75rem', color: '#8B4513' },
    list: { paddingLeft: '1.5rem', lineHeight: '1.8' },
    listItem: { marginBottom: '0.5rem', color: '#5D4037' },
    exampleBox: { backgroundColor: '#F5F5DC', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '2px solid #8B4513' },
    exampleTitle: { fontSize: '1.125rem', marginBottom: '0.75rem', color: '#8B4513' },
    codeBlock: { backgroundColor: '#2d2d2d', color: '#f8f8f2', padding: '1rem', borderRadius: '8px', overflow: 'auto', fontSize: '0.875rem', lineHeight: '1.6', fontFamily: 'monospace', marginBottom: '1rem' },
    exampleExplanation: { fontSize: '0.9375rem', lineHeight: '1.6', color: '#5D4037', margin: 0 },
    quizTitle: { fontSize: '1.75rem', color: '#8B4513', margin: '0 0 0.5rem 0' },
    quizSubtitle: { fontSize: '1rem', color: '#8D6E63', margin: 0 },
    questionBox: { marginTop: '2rem' },
    questionText: { fontSize: '1.25rem', marginBottom: '1.5rem', color: '#5D4037' },
    option: { padding: '1rem 1.5rem', marginBottom: '0.75rem', border: '2px solid', borderRadius: '12px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', fontSize: '1rem', backgroundColor: 'white' },
    feedbackBox: { marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' },
    footer: { padding: '1.5rem 0', borderTop: '2px solid #DEB887', display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' },
    nextButton: { padding: '0.85rem 2.5rem', backgroundColor: '#8B4513', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 6px 12px rgba(139, 69, 19, 0.3)' },
    rightPanel: {
        flex: '0 0 45%',
        backgroundImage: 'url(/playground.png)',
        backgroundSize: '100% auto',
        backgroundRepeat: 'repeat-y',
        backgroundAttachment: 'scroll',
        overflowY: 'auto',
        padding: '2rem 1rem',
        position: 'relative'
    },
    roadmapPath: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    startBadge: { backgroundColor: '#8d6e63', color: 'white', padding: '4px 12px', borderRadius: '4px', position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', zIndex: 6, fontWeight: 'bold', fontSize: '0.9rem', border: '2px solid #FFF8DC' },
    boardSign: { marginTop: '5px', textAlign: 'center' },
    boardTitle: { fontSize: '0.8rem', color: '#5D4037', fontWeight: 'bold', backgroundColor: 'rgba(255, 248, 220, 0.9)', padding: '4px 10px', borderRadius: '8px', display: 'inline-block', border: '2px solid #8B4513', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    lessonContent: { animation: 'fadeIn 0.5s ease-out' }
};

if (typeof document !== 'undefined') {
    const styleId = 'roadmap-animations';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            #roadmap-scroll-container::-webkit-scrollbar { width: 8px; }
            #roadmap-scroll-container::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
            #roadmap-scroll-container::-webkit-scrollbar-thumb { background: #DEB887; borderRadius: 4px; }
        `;
        document.head.appendChild(style);
    }
}

export default Roadmap;
