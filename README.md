# 🐿️ NutriQuest

NutriQuest is a gamified learning platform that transforms educational journeys into rewarding adventures. Collect badges, earn streaks, and level up your skills—one acorn at a time.

## 🚀 Key Features

- **Interactive Roadmaps**: Visualize your progress through a winding forest path of stepping stones and level stumps.
- **AI-Powered Learning**: Generate personalized course content and quizzes using integrated OpenAI models.
- **Quest System**: Complete daily tasks, earn XP, and unlock achievements.
- **Personalized Profile**: Track your learning history, manage favorites, and monitor your streaks with a dedicated calendar.
- **Social Features**: Connect with the community and share your progress.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Vanilla CSS & Tailwind CSS
- **Authentication**: JWT-based with Google OAuth integration
- **State Management**: React Context API

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js for OAuth 2.0
- **AI Integration**: OpenAI SDK

## 📋 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (local or Atlas)
- Clerk account (for authentication)
- OpenAI API Key (for AI features)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nutriquest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   OPENAI_API_KEY=your_openai_key
   MONGODB_URI=your_mongodb_uri
   SESSION_SECRET=your_session_secret
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```
   This will start both the Vite development server (port 5173/3000) and the Node.js API server (port 3001).

## 📁 Project Structure

```text
nutriquest/
├── src/               # Frontend source code
│   ├── components/    # Reusable UI components (Mascot, Stumps, etc.)
│   ├── context/       # Auth and Global state
│   ├── pages/         # Page components (Landing, Roadmap, Profile)
│   └── utils/         # Helper functions and API config
├── server/            # Backend Node.js server
│   ├── routes/        # API endpoints
│   ├── models/        # MongoDB schemas
│   └── config/        # Passport and Database config
├── public/            # Static assets (images, icons)
└── .env               # Environment configuration
```

---
Made with ❤️ by Shaurya Singh
