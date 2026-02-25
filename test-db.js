import 'dotenv/config';
import mongoose from 'mongoose';
import Course from './server/models/Course.js';

async function test() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected');

        console.time('DB_FETCH_COURSES');
        const courses = await Course.find({})
            .select('id title description thumbnail category difficulty totalXP isAIGenerated lessons.id lessons.title lessons.xp')
            .sort({ createdAt: -1 })
            .lean();
        console.timeEnd('DB_FETCH_COURSES');

        console.log('Courses found:', courses.length);
        if (courses.length > 0) {
            console.log('First course:', JSON.stringify(courses[0], null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

test();
