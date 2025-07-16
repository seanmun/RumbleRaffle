# 🎯 Rumble Raffle

A modern web application for creating and managing wrestling-themed raffle leagues with friends. Perfect for Royal Rumble watch parties, wrestling events, and fantasy wrestling competitions.

## ✨ Features

### 🏆 League Management
- **Create Custom Leagues** - Set up leagues with any number of participants (2-30)
- **Flexible Entry Distribution** - Participants can buy different numbers of entries
- **Shareable League URLs** - Send friends a link to view and track the league
- **One-Time Number Drawing** - Fair randomization that can't be gamed

### 📺 Live Tracking
- **Real-Time Wrestler Assignment** - Assign wrestlers to entry numbers as they're revealed
- **Custom Wrestler Support** - Add surprise celebrity appearances or custom entries
- **Elimination Tracking** - Mark wrestlers as eliminated with undo functionality
- **Winner Celebration** - Automatic winner detection and celebration

### 🎨 Modern Design
- **Clean, Professional UI** - Modern dark theme with intuitive controls
- **Mobile Responsive** - Perfect for watching on phones during live events
- **Auto-Refresh** - Manual refresh button plus auto-polling every 5 minutes
- **Accessibility Focused** - Clear status indicators and easy-to-use controls

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React 19** - Latest React features

### Backend
- **Express.js** - API server
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Reliable data persistence via Neon
- **TypeScript** - End-to-end type safety

### Deployment
- **Vercel** - Frontend hosting and serverless functions
- **Neon** - Serverless PostgreSQL database

## 🛠️ Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rumble-raffle.git
   cd rumble-raffle
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment file
   cp .env.example .env.local
   
   # Add your database URL to .env.local
   DATABASE_URL="your-neon-database-url"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client and push schema
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   npm run dev
   ```

6. **Open the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 📱 How to Use

### Creating a League

1. **Go to Create League page** (`/create-league`)
2. **Enter league name** (e.g., "Royal Rumble 2024")
3. **Set number of participants** (2-30 people)
4. **Distribute entries** - Each person gets a certain number of raffle entries
5. **Ensure total equals 30** - Perfect for Royal Rumble format
6. **Create league** - Get a shareable URL

### Sharing with Friends

1. **Share the league URL** - Send to all participants
2. **Everyone can view** - No accounts required
3. **Draw numbers** - One-time randomization assigns entry numbers
4. **Open live tracker** - Use the dedicated tracking page during events

### Live Tracking

1. **Assign wrestlers** - Click entries to assign wrestlers as they're revealed
2. **Track eliminations** - Mark wrestlers as eliminated in real-time
3. **Undo mistakes** - Easily reverse eliminations if needed
4. **Celebrate winner** - Automatic detection when only one remains

## 🏗️ Project Structure

```
rumble-raffle/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js App Router pages
│   │   ├── create-league/        # League creation flow
│   │   ├── league/[id]/          # Individual league view
│   │   ├── live-tracker/[id]/    # Live tracking interface
│   │   └── api/                  # API route handlers
│   ├── components/               # Reusable React components
│   └── types/                    # TypeScript type definitions
├── backend/                      # Express.js API server
│   ├── server.ts                 # Main server file
│   └── dist/                     # Compiled JavaScript
├── prisma/                       # Database schema and migrations
│   └── schema.prisma             # Database schema definition
└── docs/                         # Next.js build output
```

## 🗄️ Database Schema

The app uses a PostgreSQL database with the following main tables:

- **Leagues** - Store league information and settings
- **Participants** - People participating in each league
- **Entrants** - Individual raffle entries (1-30 per league)
- **Events** - Activity log for live tracking

## 🚀 Deployment

### Prerequisites
- Vercel account
- Neon database (or other PostgreSQL provider)

### Deploy to Vercel

1. **Connect to Vercel**
   ```bash
   vercel login
   vercel link
   ```

2. **Set up database**
   - Create Neon database via Vercel marketplace
   - Environment variables will be automatically configured

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables

Required environment variables for production:

```env
DATABASE_URL=your-neon-database-url
NEXT_PUBLIC_API_URL=your-backend-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Built with modern web technologies
- Inspired by the excitement of wrestling watch parties
- Designed for ease of use during live events

---

**Ready to rumble?** Create your first league and start the excitement! 🤼‍♂️