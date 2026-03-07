# ALGorithia AI Engine Server

Lightweight backend AI analysis system that runs silently in the background.

## 🎯 Purpose

Analyzes user performance after each simulation to:
- Track behavior patterns
- Detect vulnerabilities
- Recommend next challenges
- Adjust difficulty dynamically

## 📁 Structure

```
server/
├── engines/              # AI analysis engines
│   ├── behavior-tracker.engine.js
│   ├── pattern-memory.engine.js
│   ├── predictability-model.engine.js
│   ├── exploitability-index.engine.js
│   ├── vulnerability-matrix.engine.js
│   ├── strategic-intent.engine.js
│   ├── adaptive-trap.engine.js
│   └── hunter-escalation.engine.js
├── services/
│   └── analysis.service.js    # Orchestrates engines
├── routes/
│   └── analyze.route.js       # API endpoints
├── server.js                  # Express server
└── package.json
```

## 🚀 Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Start Server

```bash
npm start
```

Server will run on: `http://localhost:5000`

### 3. Development Mode (with auto-reload)

```bash
npm run dev
```

## 📡 API Endpoints

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
  "edgeCaseFailures": 0,
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
    "vulnerability": { "primaryWeakness": "none" },
    "strategy": { "strategyType": "support" },
    "nextQuestion": { "id": "bubble-sort", "title": "Bubble Sort" },
    "escalation": { "escalationStage": 2, "pressureMultiplier": 1.25 },
    "summary": {
      "exploitabilityScore": 35,
      "riskLevel": "low-risk",
      "primaryWeakness": "none",
      "recommendedStrategy": "support",
      "escalationStage": 2
    }
  }
}
```

### GET /api/analyze/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Analysis Engine",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧠 AI Engines

### 1. Behavior Tracker
- Calculates behavior score (0-100)
- Considers time, attempts, edge cases
- Higher score = better performance

### 2. Pattern Memory
- Tracks mistake history
- Calculates mistake frequency
- Identifies recurring patterns

### 3. Predictability Model
- Determines predictability level
- Combines behavior + consistency
- Levels: highly-predictable to highly-unpredictable

### 4. Exploitability Index
- Combines behavior + predictability
- Calculates exploitability score
- Risk levels: low, moderate, high

### 5. Vulnerability Matrix
- Detects weakness areas
- Categories: time-pressure, logic-errors, edge-cases
- Identifies primary vulnerability

### 6. Strategic Intent
- Determines best strategy
- Types: support, probe, exploit
- Provides tactical recommendations

### 7. Adaptive Trap
- Selects next question
- Based on vulnerabilities + strategy
- Targets weak areas or encourages growth

### 8. Hunter Escalation
- Adjusts difficulty level
- Tracks consecutive successes/failures
- Stages: 1 (Beginner) to 5 (Master)

## 🔄 Analysis Pipeline

```
User completes simulation
         ↓
Frontend sends metrics
         ↓
Behavior Tracker → Pattern Memory → Predictability Model
         ↓
Exploitability Index → Vulnerability Matrix
         ↓
Strategic Intent → Adaptive Trap → Hunter Escalation
         ↓
Return complete analysis
```

## ⚙️ Configuration

### Port
Default: `5000`

Change in `server.js`:
```javascript
const PORT = process.env.PORT || 5000;
```

### CORS
Enabled for all origins by default.

Restrict in `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

## 🔍 Debugging

### View Analysis Logs
Server logs each analysis:
```
[AI Analysis] User: user-123, Question: array-traversal, Score: 35
```

### Frontend Console
Check browser console for analysis results:
```javascript
console.log('[AI Analysis]', data);
```

## 🚨 Important Notes

1. **Silent Operation**: Server runs independently, frontend works even if server is offline
2. **No UI Changes**: Analysis happens in background, doesn't affect user experience
3. **In-Memory Storage**: Pattern memory stored in RAM (resets on server restart)
4. **No External Dependencies**: Uses only Express and CORS
5. **Question Import**: Engines can access frontend questions via require()

## 🔮 Future Enhancements

- Persistent storage (database)
- Real-time recommendations in UI
- Advanced ML models
- User progress tracking
- Performance analytics dashboard

## 📝 License

MIT
