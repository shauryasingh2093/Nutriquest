export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
    xp: number;
    level: number;
    streak: number;
    longestStreak?: number;
    achievements: Achievement[];
    completedLessons: string[];
    stageProgress?: Record<string, StageProgress>;
    lastActivityDate?: string;
    favorites: string[];
    history: string[];
    calendarNotes: Record<string, string[]>;
}

export interface Achievement {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt?: string;
}

export interface StageProgress {
    read: boolean;
    practice: boolean;
    notes: boolean;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    lessons: Lesson[];
    category?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    totalXP?: number;
}

export interface Lesson {
    id: string;
    title: string;
    xp: number;
    type?: string;
    difficulty: string;
    estimatedMinutes: number;
    stages: {
        read: ReadStage;
        practice: PracticeStage;
        notes: NotesStage;
    };
}

export interface QuizResults {
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    results: QuizStepResult[];
}

export interface QuizStepResult {
    questionId: string;
    isCorrect: boolean;
    correctAnswer: number;
    explanation: string;
}

export interface ReadStage {
    xp: number;
    introduction: string;
    sections: ReadSection[];
}

export interface ReadSection {
    title: string;
    content: string;
    keyPoints?: string[];
    example?: {
        code: string;
        explanation: string;
    };
}

export interface PracticeStage {
    xp: number;
    questions: Question[];
}

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    xpReward: number;
}

export interface NotesStage {
    xp: number;
    summary: string;
    keyTakeaways: string[];
}
