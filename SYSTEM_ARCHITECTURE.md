# 🏗️ ALGorithia System Architecture

## Overview

ALGorithia is a dual-server application with frontend visualization and backend AI analysis.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │         React Frontend (Port 5173)                  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Landing Page → Questions Hub → Simulation   │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Phaser Visualization Engine                 │  │    │
│  │  │  • Array District                            │  │    │
│  │  │  • LinkedList Harbor                         │  │    │
│  │  │  • Stack Tower                               │  │    │
│  │  │  • Queue Lane                                │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  Code Execution Engine                       │  │    │
│  │  │  • Parser                                    │  │    │
│  │  │  • Interpreter                               │  │    │
│  │  │  • Step Generator                            │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP POST /api/analyze
                            │ (Silent, Async)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Express Backend (Port 5000)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │              AI Analysis Pipeline                   │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  1. Behavior Tracker                         │  │    │
│  │  │     → Calculate performance score            │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  2. Pattern Memory                           │  │    │
│  │  │     → Track mistake patterns                 │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  3. Predictability Model                     │  │    │
│  │  │     → Determine consistency                  │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  4. Exploitability Index                     │  │    │
│  │  │     → Calculate vulnerability                │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  5. Vulnerability Matrix                     │  │    │
│  │  │     → Detect weaknesses                      │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  6. Strategic Intent                         │  │    │
│  │  │     → Choose strategy                        │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  7. Adaptive Trap                            │  │    │
│  │  │     → Recommend next question                │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  8. Hunter Escalation                        │  │    │
│  │  │     → Adjust difficulty                      │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### User Solves Question

```
1. User writes code
        ↓
2. Click "Run Simulation"
        ↓
3. Parser → Interpreter → Step Generator
        ↓
4. Phaser plays visualization
        ↓
5. Validation checks result
        ↓
6. [NEW] Send metrics to AI backend
        ↓
7. AI analyzes performance
        ↓
8. Return analysis (logged to console)
```

---

## Component Interaction

### Frontend Components

```
┌─────────────────────────────────────────────────────┐
│                  App.jsx (Router)                    │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ LandingPage  │ │ QuestionsPage│ │ DataCityPage │
└──────────────┘ └──────────────┘ └──────────────┘
                        │               │
                        ↓               ↓
                ┌──────────────┐ ┌──────────────┐
                │ QuestionCard │ │  GamePanel   │
                └──────────────┘ │ EditorPanel  │
                                 └──────────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        ↓               ↓               ↓
                ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
                │ DataCityScene│ │LinkedListScene│ │  StackScene  │
                │ (Array)      │ │              │ │  QueueScene  │
                └──────────────┘ └──────────────┘ └──────────────┘
```

### Backend Components

```
┌─────────────────────────────────────────────────────┐
│              server.js (Express App)                 │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│           analyze.route.js (API Routes)              │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│      analysis.service.js (Orchestrator)              │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Engine 1   │ │   Engine 2   │ │   Engine 3   │
│   Engine 4   │ │   Engine 5   │ │   Engine 6   │
│   Engine 7   │ │   Engine 8   │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## Request/Response Flow

### Simulation Execution

```
User Action: Click "Run Simulation"
        ↓
┌─────────────────────────────────────────┐
│  DataCityPage.jsx: handleRun()          │
│  • Parse user code                      │
│  • Generate simulation steps            │
│  • Play visualization                   │
│  • Validate result                      │
│  • [NEW] Send AI analysis request       │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  HTTP POST /api/analyze                 │
│  Body: {                                │
│    userId, questionId, timeTaken,       │
│    incorrectAttempts, success           │
│  }                                      │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  Backend: analyze.route.js              │
│  • Validate input                       │
│  • Call analysis.service                │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  analysis.service.js                    │
│  • Run 8 engines sequentially           │
│  • Compile results                      │
│  • Return analysis                      │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  Response: Complete Analysis Object     │
│  • Behavior score                       │
│  • Exploitability score                 │
│  • Vulnerabilities                      │
│  • Strategy recommendation              │
│  • Next question suggestion             │
│  • Escalation level                     │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  Frontend: console.log()                │
│  • Log analysis silently                │
│  • No UI changes                        │
└─────────────────────────────────────────┘
```

---

## State Management

### Frontend State

```
DataCityPage Component State:
├── userCode (string)
├── runtimeError (object | null)
├── validation (object | null)
├── isRunning (boolean)
├── currentLine (number | null)
├── currentState (object)
│   ├── line
│   ├── variables
│   └── arr
└── eventLog (array)
```

### Backend State

```
In-Memory Storage:
├── userMistakeHistory (Map)
│   └── userId → [attempts history]
└── userEscalationState (Map)
    └── userId → {
        stage,
        consecutiveSuccesses,
        consecutiveFailures,
        totalQuestions
    }
```

---

## Technology Stack

### Frontend
```
React 19
├── Vite (Build tool)
├── React Router (Routing)
├── Phaser 3.90 (Game engine)
├── Monaco Editor (Code editor)
└── Framer Motion (Animations)
```

### Backend
```
Node.js 20+
├── Express 4.18 (Web framework)
├── CORS (Cross-origin)
└── Custom AI Engines (No external ML libs)
```

---

## File Structure

```
Algorithia/
│
├── Frontend (src/)
│   ├── components/
│   │   ├── GamePanel.jsx
│   │   ├── EditorPanel.jsx
│   │   ├── QuestionCard.jsx
│   │   └── sections/
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── QuestionsPage.jsx
│   │   └── DataCityPage.jsx ← [MODIFIED]
│   │
│   ├── game/
│   │   ├── DataCityScene.js
│   │   ├── gameBridge.js
│   │   └── districts/
│   │       ├── LinkedListScene.js
│   │       ├── StackScene.js
│   │       └── QueueScene.js
│   │
│   ├── engine/ [DO NOT MODIFY]
│   │   ├── parser.js
│   │   ├── interpreter.js
│   │   └── stepGenerator.js
│   │
│   └── data/
│       └── questions.js (18 questions)
│
└── Backend (server/)
    ├── engines/
    │   ├── behavior-tracker.engine.js
    │   ├── pattern-memory.engine.js
    │   ├── predictability-model.engine.js
    │   ├── exploitability-index.engine.js
    │   ├── vulnerability-matrix.engine.js
    │   ├── strategic-intent.engine.js
    │   ├── adaptive-trap.engine.js
    │   └── hunter-escalation.engine.js
    │
    ├── services/
    │   └── analysis.service.js
    │
    ├── routes/
    │   └── analyze.route.js
    │
    └── server.js
```

---

## Network Communication

### Endpoints

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000

API Endpoints:
├── POST /api/analyze
│   └── Analyze user performance
│
└── GET /api/analyze/health
    └── Health check
```

### CORS Configuration

```javascript
// server/server.js
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## Deployment Architecture

### Development

```
Developer Machine
├── Terminal 1: npm run dev (Frontend)
└── Terminal 2: cd server && npm start (Backend)
```

### Production

```
┌─────────────────────────────────────┐
│  Frontend (Vercel/Netlify)          │
│  • Static build (dist/)             │
│  • CDN distribution                 │
│  • HTTPS enabled                    │
└─────────────────────────────────────┘
            │
            │ HTTPS
            ↓
┌─────────────────────────────────────┐
│  Backend (Heroku/Railway/AWS)       │
│  • Node.js server                   │
│  • Express API                      │
│  • Environment variables            │
└─────────────────────────────────────┘
```

---

## Security Architecture

### Frontend Security
- Input sanitization
- XSS prevention
- HTTPS in production
- No sensitive data storage

### Backend Security
- CORS configuration
- Input validation
- Error handling
- Rate limiting (future)
- Authentication (future)

---

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Asset optimization
- Phaser scene management

### Backend
- In-memory caching
- Async operations
- Efficient algorithms
- Connection pooling (future)

---

## Monitoring & Logging

### Frontend
```javascript
console.log('[AI Analysis]', data);
// Logs analysis results to browser console
```

### Backend
```javascript
console.log('[AI Analysis] User: X, Question: Y, Score: Z');
// Logs analysis summary to server console
```

---

## Scalability Considerations

### Current (Single Server)
```
Frontend → Backend (1 instance)
```

### Future (Horizontal Scaling)
```
Frontend → Load Balancer → Backend (N instances)
                         → Database (Shared state)
```

---

## Error Handling

### Frontend
```javascript
try {
  await fetch('/api/analyze', { ... });
} catch (error) {
  console.log('[AI Analysis] Backend offline');
  // Continue normally - graceful degradation
}
```

### Backend
```javascript
try {
  const result = analysisService.runAnalysis(data);
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Analysis error:', error);
  res.status(500).json({ error: true, message: error.message });
}
```

---

## Summary

ALGorithia uses a **dual-server architecture** with:
- **Frontend**: React + Phaser for interactive visualization
- **Backend**: Express + AI engines for intelligent analysis
- **Communication**: RESTful API with silent background calls
- **Design**: Modular, scalable, production-ready

The system maintains **complete separation** between visualization and analysis, ensuring the user experience remains unchanged while gaining intelligent insights in the background.

---

**Architecture is clean, modular, and ready for future enhancements!** 🏗️
