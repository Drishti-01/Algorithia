# 🤖 AI Engine Integration - Complete Setup Guide

## ✅ What Was Added

A lightweight AI analysis system that runs **silently in the background** without affecting the user experience.

### Key Features:
- ✅ Analyzes user performance after each simulation
- ✅ Tracks behavior patterns and mistakes
- ✅ Detects vulnerabilities and weaknesses
- ✅ Recommends next challenges
- ✅ Adjusts difficulty dynamically
- ✅ **Works independently** - frontend continues normally even if backend is offline

---

## 📁 New Files Created

### Backend (server/)
```
server/
├── engines/                           # 8 AI analysis engines
│   ├── behavior-tracker.engine.js     # Calculates behavior score
│   ├── pattern-memory.engine.js       # Tracks mistake patterns
│   ├── predictability-model.engine.js # Determines predictability
│   ├── exploitability-index.engine.js # Calculates exploitability
│   ├── vulnerability-matrix.engine.js # Detects weaknesses
│   ├── strategic-intent.engine.js     # Determines strategy
│   ├── adaptive-trap.engine.js        # Selects next question
│   └── hunter-escalation.engine.js    # Adjusts difficulty
├── services/
│   └── analysis.service.js            # Orchestrates all engines
├── routes/
│   └── analyze.route.js               # API endpoints
├── server.js                          # Express server
├── package.json                       # Dependencies
└── README.md                          # Documentation
```

### Frontend (Modified)
```
src/pages/DataCityPage.jsx             # Added AI analysis call
```

---

## 🚀 Setup Instructions

### Step 1: Install Backend Dependencies

Open a **new terminal** (keep frontend running) and run:

```bash
cd server
npm install
```

This installs:
- `express` - Web server
- `cors` - Cross-origin requests
- `nodemon` - Auto-reload (dev only)

### Step 2: Start AI Engine Server

```bash
npm start
```

You should see:
```
=================================
AI Engine Server Running
Port: 5000
URL: http://localhost:5000
=================================
```

### Step 3: Keep Both Servers Running

You now have **two servers**:

1. **Frontend** (Vite): `http://localhost:5173` - User interface
2. **Backend** (Express): `http://localhost:5000` - AI analysis

Both must run simultaneously.

### Step 4: Test the Integration

1. Open browser: `http://localhost:5173`
2. Go to Questions page
3. Select any question
4. Write code and click "Run Simulation"
5. After simulation completes, check browser console (F12)
6. You should see: `[AI Analysis] { success: true, data: {...} }`

---

## 🧪 Testing

### Test 1: Health Check

Open browser or use curl:
```bash
curl http://localhost:5000/api/analyze/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AI Analysis Engine",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test 2: Manual Analysis

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "questionId": "array-traversal",
    "questionCategory": "array",
    "timeTaken": 45,
    "incorrectAttempts": 1,
    "success": true
  }'
```

### Test 3: Frontend Integration

1. Solve a question in the app
2. Open browser console (F12)
3. Look for `[AI Analysis]` logs
4. Check server terminal for analysis logs

---

## 🔍 How It Works

### User Flow (Unchanged)
```
User opens question
    ↓
User writes code
    ↓
User clicks "Run Simulation"
    ↓
Visualization plays
    ↓
Validation shows result
    ↓
[NEW] AI analysis runs silently in background
```

### AI Analysis Pipeline
```
1. Behavior Tracker
   ↓ (calculates behavior score)
   
2. Pattern Memory
   ↓ (tracks mistake history)
   
3. Predictability Model
   ↓ (determines predictability)
   
4. Exploitability Index
   ↓ (calculates exploitability)
   
5. Vulnerability Matrix
   ↓ (detects weaknesses)
   
6. Strategic Intent
   ↓ (determines strategy)
   
7. Adaptive Trap
   ↓ (selects next question)
   
8. Hunter Escalation
   ↓ (adjusts difficulty)
   
Final Analysis Result
```

### Data Flow
```
Frontend (DataCityPage.jsx)
    ↓ POST /api/analyze
Backend (server.js)
    ↓ analyze.route.js
    ↓ analysis.service.js
    ↓ [8 engines run sequentially]
    ↓ Return result
Frontend (console.log)
```

---

## 📊 Analysis Output Example

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userId": "user-123",
  "questionId": "array-traversal",
  
  "behavior": {
    "behaviorScore": 85,
    "metrics": {
      "timeTaken": 45,
      "incorrectAttempts": 1,
      "edgeCaseFailures": 0
    }
  },
  
  "patterns": {
    "mistakeFrequency": 0.2,
    "averageAttempts": 1.5,
    "totalQuestions": 5
  },
  
  "predictability": {
    "score": 72,
    "level": "moderately-predictable"
  },
  
  "exploitability": {
    "score": 35,
    "riskLevel": "low-risk"
  },
  
  "vulnerability": {
    "primaryWeakness": "none",
    "vulnerabilities": [],
    "totalVulnerabilities": 0
  },
  
  "strategy": {
    "strategyType": "support",
    "reasoning": "User shows strong performance",
    "tactics": ["Offer advanced challenges"]
  },
  
  "nextQuestion": {
    "nextQuestion": {
      "id": "bubble-sort",
      "title": "Bubble Sort",
      "difficulty": "Medium"
    },
    "reasoning": "Providing advanced challenge for growth"
  },
  
  "escalation": {
    "escalationStage": 2,
    "pressureMultiplier": 1.25,
    "consecutiveSuccesses": 1,
    "recommendation": "Continue challenging the user"
  },
  
  "summary": {
    "exploitabilityScore": 35,
    "riskLevel": "low-risk",
    "primaryWeakness": "none",
    "recommendedStrategy": "support",
    "escalationStage": 2
  }
}
```

---

## 🎯 AI Engine Details

### 1. Behavior Tracker
**Purpose**: Calculate performance score

**Metrics**:
- Time taken (optimal: 60s)
- Incorrect attempts
- Edge case failures

**Output**: Behavior score (0-100)

### 2. Pattern Memory
**Purpose**: Track mistake patterns

**Storage**: In-memory (last 20 attempts)

**Output**: Mistake frequency (0-1)

### 3. Predictability Model
**Purpose**: Determine consistency

**Factors**:
- Behavior score
- Mistake frequency
- Time consistency

**Levels**: highly-predictable, moderately-predictable, somewhat-unpredictable, highly-unpredictable

### 4. Exploitability Index
**Purpose**: Identify vulnerability

**Formula**: (100 - behaviorScore) * 0.6 + predictability * 0.4

**Risk Levels**: low-risk, moderate-risk, high-risk

### 5. Vulnerability Matrix
**Purpose**: Detect weakness areas

**Categories**:
- time-pressure
- logic-errors
- edge-cases
- category-specific

**Output**: Primary weakness + list of vulnerabilities

### 6. Strategic Intent
**Purpose**: Choose teaching strategy

**Strategies**:
- **support**: Strong performance → advanced challenges
- **probe**: Moderate performance → test boundaries
- **exploit**: Weak performance → target weaknesses

**Output**: Strategy type + tactics

### 7. Adaptive Trap
**Purpose**: Select next question

**Logic**:
- Exploit strategy → harder questions in same category
- Probe strategy → different category, medium difficulty
- Support strategy → advanced challenges

**Output**: Next question recommendation

### 8. Hunter Escalation
**Purpose**: Adjust difficulty level

**Tracking**:
- Consecutive successes → escalate
- Consecutive failures → de-escalate

**Stages**: 1 (Beginner) to 5 (Master)

**Output**: Escalation stage + pressure multiplier

---

## 🔧 Configuration

### Change Server Port

Edit `server/server.js`:
```javascript
const PORT = process.env.PORT || 5000;
```

Or use environment variable:
```bash
PORT=3001 npm start
```

### Restrict CORS

Edit `server/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Adjust Analysis Thresholds

Edit individual engine files in `server/engines/`

Example - `behavior-tracker.engine.js`:
```javascript
// Change optimal time from 60s to 90s
const timeRatio = timeTaken / 90;
```

---

## 🐛 Troubleshooting

### Backend Not Starting

**Error**: `Cannot find module 'express'`
```bash
cd server
npm install
```

**Error**: `Port 5000 already in use`
```bash
# Change port in server.js or kill process
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows
```

### Frontend Not Connecting

**Check**: Is backend running?
```bash
curl http://localhost:5000/api/analyze/health
```

**Check**: Browser console for errors
- Open DevTools (F12)
- Look for network errors
- Check CORS errors

### No Analysis Logs

**Check**: Browser console (F12)
- Should see `[AI Analysis]` logs
- If "Backend offline" → start server

**Check**: Server terminal
- Should see analysis logs
- Format: `[AI Analysis] User: ..., Question: ..., Score: ...`

---

## 📝 Development Tips

### Run in Development Mode

```bash
cd server
npm run dev
```

Auto-reloads on file changes.

### Add New Engine

1. Create file in `server/engines/`
2. Export `analyze(data)` function
3. Import in `server/services/analysis.service.js`
4. Add to pipeline

Example:
```javascript
// server/engines/my-engine.engine.js
module.exports = {
    analyze(data) {
        return { result: 'my analysis' };
    }
};
```

### View All Logs

**Server logs**:
```bash
cd server
npm start
```

**Frontend logs**:
- Browser console (F12)
- Look for `[AI Analysis]`

---

## ✅ Verification Checklist

- [ ] Backend dependencies installed (`npm install` in server/)
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Health check returns "healthy"
- [ ] Solving a question triggers analysis
- [ ] Browser console shows `[AI Analysis]` logs
- [ ] Server terminal shows analysis logs
- [ ] Frontend works even if backend is offline

---

## 🚀 Next Steps

### Current State
✅ AI analysis runs silently in background
✅ Tracks user performance
✅ Recommends next questions
✅ Adjusts difficulty

### Future Enhancements
- [ ] Display recommendations in UI
- [ ] Add database for persistent storage
- [ ] Create analytics dashboard
- [ ] Implement real-time hints
- [ ] Add user progress tracking
- [ ] Build performance reports

---

## 📚 Additional Resources

- **Server README**: `server/README.md`
- **Engine Documentation**: See individual engine files
- **API Documentation**: `server/routes/analyze.route.js`

---

## 🎉 Summary

You now have a complete AI analysis system that:
- Runs independently in the background
- Analyzes user performance after each simulation
- Provides intelligent recommendations
- Adjusts difficulty dynamically
- **Does not affect the user experience**

The frontend continues to work exactly as before, with AI analysis happening silently behind the scenes!
