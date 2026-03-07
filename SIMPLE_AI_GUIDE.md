# 🤖 Simple AI Engine - Quick Guide

## Overview

A minimal AI system with just **4 engines** that analyzes user performance and recommends the next question.

---

## 🎯 How It Works

```
User solves question
        ↓
Frontend sends: questionId, timeTaken, incorrectAttempts
        ↓
Backend runs 4 engines:
  1. Behavior Engine → Calculate score
  2. Exploitability Engine → Calculate vulnerability
  3. Strategy Engine → Choose strategy
  4. Adaptive Trap Engine → Recommend next question
        ↓
Return: behaviorScore, exploitabilityScore, strategy, nextQuestion
        ↓
Console logs recommendation
```

---

## 🧠 The 4 Engines

### 1. Behavior Engine
**Purpose**: Calculate performance score

**Logic**:
```javascript
behaviorScore = 100
behaviorScore -= incorrectAttempts * 10
if (timeTaken > 60) {
  behaviorScore -= (timeTaken - 60) / 10
}
// Clamp between 0-100
```

**Output**: `{ behaviorScore: 85 }`

### 2. Exploitability Engine
**Purpose**: Calculate vulnerability

**Logic**:
```javascript
exploitabilityScore = 100 - behaviorScore
```

**Output**: `{ exploitabilityScore: 15 }`

### 3. Strategy Engine
**Purpose**: Choose teaching strategy

**Logic**:
```javascript
if (exploitabilityScore >= 60) → 'exploit'
if (exploitabilityScore >= 30) → 'probe'
if (exploitabilityScore < 30) → 'support'
```

**Output**: `{ strategy: 'support' }`

### 4. Adaptive Trap Engine
**Purpose**: Recommend next question

**Logic**:
```javascript
if (strategy === 'exploit') → Harder question
if (strategy === 'probe') → Medium question
if (strategy === 'support') → Easier question
```

**Output**: 
```javascript
{
  nextQuestion: {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    difficulty: 'Medium',
    category: 'array'
  }
}
```

---

## 📡 API

### Endpoint
```
POST http://localhost:5000/api/analyze
```

### Request
```json
{
  "questionId": "array-traversal",
  "questionCategory": "array",
  "timeTaken": 45,
  "incorrectAttempts": 1
}
```

### Response
```json
{
  "behaviorScore": 85,
  "exploitabilityScore": 15,
  "strategy": "support",
  "nextQuestion": {
    "id": "bubble-sort",
    "title": "Bubble Sort",
    "difficulty": "Medium",
    "category": "array"
  }
}
```

---

## 🚀 Usage

### Start Servers
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

### Test
1. Open http://localhost:5173
2. Solve any question
3. Check console (F12)
4. See: `[AI Recommendation] { ... }`

---

## 📊 Example Flow

### Scenario 1: Strong Performance
```
Input:
  timeTaken: 30 seconds
  incorrectAttempts: 0

Output:
  behaviorScore: 100
  exploitabilityScore: 0
  strategy: 'support'
  nextQuestion: 'Binary Search' (Hard)
```

### Scenario 2: Moderate Performance
```
Input:
  timeTaken: 90 seconds
  incorrectAttempts: 2

Output:
  behaviorScore: 77
  exploitabilityScore: 23
  strategy: 'support'
  nextQuestion: 'Find Maximum' (Easy)
```

### Scenario 3: Weak Performance
```
Input:
  timeTaken: 180 seconds
  incorrectAttempts: 5

Output:
  behaviorScore: 38
  exploitabilityScore: 62
  strategy: 'exploit'
  nextQuestion: 'Bubble Sort' (Hard)
```

---

## 🔧 File Structure

```
server/
├── engines/
│   ├── behavior.engine.js          # Score calculation
│   ├── exploitability.engine.js    # Vulnerability
│   ├── strategy.engine.js          # Strategy selection
│   └── adaptive-trap.engine.js     # Question recommendation
├── services/
│   └── analysis.service.js         # Runs all 4 engines
├── routes/
│   └── analyze.route.js            # API endpoint
└── server.js                       # Express server
```

---

## 💡 Key Points

1. **Simple**: Only 4 engines, easy to understand
2. **Fast**: Analysis completes in < 50ms
3. **Silent**: Runs in background, no UI changes
4. **Smart**: Adapts to user performance
5. **Safe**: Frontend works even if backend is offline

---

## 🎓 Understanding the Logic

### Why Exploitability = 100 - Behavior?
- High behavior score (90) → Low exploitability (10) → User is strong
- Low behavior score (30) → High exploitability (70) → User is weak

### Why 3 Strategies?
- **Exploit** (60+): User is weak, challenge them harder
- **Probe** (30-60): User is moderate, test their limits
- **Support** (<30): User is strong, give advanced challenges

### Why Recommend Based on Difficulty?
- Weak users need harder questions to improve
- Strong users need easier questions to build confidence
- Moderate users need medium questions to test boundaries

---

## 🧪 Testing

### Test Backend
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"questionId":"array-traversal","timeTaken":45,"incorrectAttempts":1}'
```

### Test Frontend
1. Solve a question
2. Open console (F12)
3. Look for: `[AI Recommendation]`

---

## 🔮 Future Enhancements

Want to make it smarter? Add:
- User history tracking
- Category-specific recommendations
- Time-based difficulty adjustment
- Learning path generation

---

**Simple, Smart, and Effective!** 🎯
