import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '../data/users.json');
const COURSES_FILE = path.join(__dirname, '../data/courses.json');
const LESSONS_FILE = path.join(__dirname, '../data/lessons.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Users
export function readUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            return [];
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
}

export function writeUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users:', error);
    }
}

// Courses
export function readCourses() {
    try {
        if (!fs.existsSync(COURSES_FILE)) {
            return [];
        }
        const data = fs.readFileSync(COURSES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading courses:', error);
        return [];
    }
}

export function writeCourses(courses) {
    try {
        fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
    } catch (error) {
        console.error('Error writing courses:', error);
    }
}

// Lessons
export function readLessons() {
    try {
        if (!fs.existsSync(LESSONS_FILE)) {
            return {};
        }
        const data = fs.readFileSync(LESSONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading lessons:', error);
        return {};
    }
}

export function writeLessons(lessons) {
    try {
        fs.writeFileSync(LESSONS_FILE, JSON.stringify(lessons, null, 2));
    } catch (error) {
        console.error('Error writing lessons:', error);
    }
}
