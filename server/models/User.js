import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const achievementSchema = new mongoose.Schema({
    id: String,
    name: String,
    icon: String,
    description: String,
    unlockedAt: Date
});

const stageProgressSchema = new mongoose.Schema({
    read: { type: Boolean, default: false },
    practice: { type: Boolean, default: false },
    notes: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            // Password required only for email/password auth (not OAuth)
            return !this.clerkId;
        }
    },
    clerkId: {
        type: String,
        sparse: true, // Allows null values but enforces uniqueness when present
        unique: true
    },
    avatar: String,
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastActivityDate: Date,
    achievements: [achievementSchema],
    completedLessons: [String],
    stageProgress: {
        type: Map,
        of: stageProgressSchema,
        default: {}
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON responses
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model('User', userSchema);
