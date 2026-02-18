# Daily Spark ✨

A premium daily challenge platform where users solve a new riddle, lateral thinking puzzle, or logic problem every midnight PST.

## 🚀 Features

- **Daily Challenges**: New puzzles released every midnight PST.
- **Smart Fallback**: If no challenge is scheduled, the system serves a random "Classic" Spark from 5+ months ago.
- **Identity & Progress**:
  - **Streaks & High Scores**: Track your daily solve streaks and climb the leaderboard.
  - **Brain Heatmap**: Visual activity tracker for your cognitive journey.
  - **Renaming**: Seamlessly change your nickname while preserving all your stats and badges.
  - **Duplicate Protection**: Unique nicknames for every user.
- **Admin Panel**: Robust management interface to schedule, update, and delete challenges.
- **Answer Matching**: Ultra-relaxed matching (case-insensitive, ignores articles and punctuation).
- **Referral System**: Share challenges with friends and track referrals in your profile.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Prisma with SQLite (Dev) / PostgreSQL (Prod)
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: Shadcn/UI & Radix UI

## 📋 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nikhil/question-per-day.git
   cd question-per-day
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   node prisma/seed.js
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to start sparking!

## 🔐 Admin Access

Management tools are available at `/admin`.
- Schedule challenges for specific dates.
- Real-time server time tracking (PST).
- Duplicate date protection (alerts if a date is already booked).

## 📄 License

MIT
