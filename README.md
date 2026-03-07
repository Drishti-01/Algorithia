# Algorithia (Data City)

Algorithia is an interactive learning platform that combines Phaser-powered visualizations with React-driven UI. Students explore algorithm-themed districts, solve coding challenges, and watch their code execute line-by-line with real-time visual feedback.

## ✨ Features

- **4 Interactive Districts**: Array, LinkedList Harbor, Stack Tower, Queue Lane
- **18 Coding Challenges**: From beginner to advanced difficulty
- **Real-time Visualization**: Watch your code execute step-by-step
- **AI-Powered Analysis**: Background intelligence system that adapts to your performance
- **Monaco Editor**: Professional code editing experience
- **Instant Validation**: Immediate feedback on your solutions

## 🎮 Tech Stack

### Frontend
- React 19 + Vite for UI and routing
- Phaser 3.90 for game visualization
- Monaco Editor for code editing
- Framer Motion for animations

### Backend (AI Engine)
- Express.js for REST API
- 8 specialized AI engines for performance analysis
- In-memory pattern tracking
- Adaptive difficulty system

## 📋 Prerequisites

- Node.js 20.10+ (LTS)
- npm 10+
- Git

## 🚀 Quick Start

### Option 1: Run Both Servers Manually (Recommended)

**Terminal 1 - Frontend:**
```bash
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

**Terminal 2 - Backend (AI Engine):**
```bash
cd server
npm install
npm start
```
Backend runs on: `http://localhost:5000`

### Option 2: Automatic Start

**Mac/Linux:**
```bash
chmod +x start-all.sh
./start-all.sh
```

**Windows:**
```bash
start-all.bat
```

## 📁 Project Structure

```
Algorithia/
├── src/                      # Frontend source
│   ├── components/           # React components
│   ├── engine/              # Code parser & interpreter (DO NOT MODIFY)
│   ├── game/                # Phaser visualization scenes
│   │   └── districts/       # LinkedList, Stack, Queue scenes
│   ├── pages/               # Route pages
│   ├── data/                # Questions and content
│   └── simulation/          # Execution utilities
│
├── server/                   # Backend AI Engine
│   ├── engines/             # 8 AI analysis engines
│   ├── services/            # Analysis orchestration
│   ├── routes/              # API endpoints
│   └── server.js            # Express server
│
├── AI_ENGINE_SETUP.md       # Complete AI setup guide
├── AI_ENGINE_SUMMARY.md     # Quick reference
└── COMPLETE_PROJECT_STATUS.md  # Full documentation
```

## 🎯 How It Works

### User Flow
1. Select a question from the Question Hub
2. Write code in the Monaco editor
3. Click "Run Simulation"
4. Watch line-by-line execution with visualization
5. Get instant validation feedback
6. AI analyzes performance in background (silent)

### AI Analysis (Background)
- Tracks behavior patterns
- Detects vulnerabilities
- Recommends next challenges
- Adjusts difficulty dynamically
- Logs to console only (no UI changes)

## 🧪 Testing

### Test Frontend
```bash
npm run dev
# Visit http://localhost:5173
```

### Test Backend
```bash
cd server
npm test
# Or manually:
curl http://localhost:5000/api/analyze/health
```

### Test Integration
1. Solve any question
2. Open browser console (F12)
3. Look for `[AI Analysis]` logs

## 📊 Available Districts

### 1. Array District
- Array Traversal
- Find Maximum
- Bubble Sort
- Binary Search

### 2. LinkedList Harbor 🔗
- Traverse Linked List
- Find Maximum
- Count Nodes
- Search
- Doubly Linked List
- Circular Linked List

### 3. Stack Tower 📚
- Push and Pop Operations
- Peek Operation
- Reverse Array
- isEmpty Check

### 4. Queue Lane 🎫
- Enqueue and Dequeue
- Peek Front
- Front and Rear Access
- isEmpty Check

## 🔧 Build & Deploy

### Development
```bash
npm run dev          # Frontend dev server
cd server && npm run dev  # Backend with auto-reload
```

### Production Build
```bash
npm run build        # Build frontend
npm run preview      # Preview production build
```

### Linting
```bash
npm run lint         # Check code quality
```

## 🤖 AI Engine API

### POST /api/analyze
Analyze user performance after simulation.

**Request:**
```json
{
  "userId": "user-123",
  "questionId": "array-traversal",
  "questionCategory": "array",
  "timeTaken": 45,
  "incorrectAttempts": 1,
  "success": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "behavior": { "behaviorScore": 85 },
    "exploitability": { "score": 35, "riskLevel": "low-risk" },
    "strategy": { "strategyType": "support" },
    "nextQuestion": { "id": "bubble-sort" },
    "escalation": { "escalationStage": 2 }
  }
}
```

### GET /api/analyze/health
Health check endpoint.

## 📚 Documentation

- **AI_ENGINE_SETUP.md** - Complete AI engine setup guide
- **AI_ENGINE_SUMMARY.md** - Quick reference for AI system
- **COMPLETE_PROJECT_STATUS.md** - Full project documentation
- **server/README.md** - Backend-specific documentation

## 🐛 Troubleshooting

### Frontend Issues
- Clear browser cache
- Delete `node_modules` and run `npm install`
- Check console for errors (F12)

### Backend Issues
- Ensure port 5000 is available
- Check `server/node_modules` exists
- View server logs for errors

### Integration Issues
- Verify both servers are running
- Check CORS settings in `server/server.js`
- Test health endpoint: `curl http://localhost:5000/api/analyze/health`

## 🎓 Educational Value

Students learn:
- Data structure operations (Array, LinkedList, Stack, Queue)
- Algorithm visualization
- Step-by-step debugging
- Code-to-visual mapping
- Problem-solving patterns

## 🔮 Future Enhancements

- Tree and Graph visualizations
- User accounts and progress tracking
- Real-time hints in UI
- Performance analytics dashboard
- Persistent storage for AI analysis
- Advanced ML models

## 🤝 Contributing

Issues and PRs are welcome! Please include:
- Clear description of changes
- Screenshots/videos for UI changes
- Test results

## 📄 License

MIT

## 🙏 Acknowledgments

Built with React, Phaser, Express, and lots of ☕

---

**Ready to learn? Start exploring Data City!** 🏙️
