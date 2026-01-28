import mongoose from 'mongoose';

const readSectionSchema = new mongoose.Schema({
    title: String,
    content: String,
    keyPoints: [String],
    example: {
        code: String,
        explanation: String
    }
});

const questionSchema = new mongoose.Schema({
    id: String,
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    },
    xpReward: Number
});

const lessonSchema = new mongoose.Schema({
    id: String,
    title: String,
    xp: Number,
    type: String,
    difficulty: String,
    estimatedMinutes: Number,
    stages: {
        read: {
            xp: Number,
            introduction: String,
            sections: [readSectionSchema]
        },
        practice: {
            xp: Number,
            questions: [questionSchema]
        },
        notes: {
            xp: Number,
            summary: String,
            keyTakeaways: [String]
        }
    }
});

const courseSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    thumbnail: String,
    category: String,
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    totalXP: Number,
    lessons: [lessonSchema],
    isAIGenerated: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

export default mongoose.model('Course', courseSchema);
