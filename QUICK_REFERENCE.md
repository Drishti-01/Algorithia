# 🚀 ALGorithia - Quick Reference Card

## Start Servers

### Frontend
```bash
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd server
npm start
# → http://localhost:5000
```

### Both (Automatic)
```bash
./start-all.sh        # Mac/Linux
start-all.bat         # Windows
```

---

## Project Structure

```
Algorithia/
├── src/                    Frontend
│   ├── game/districts/    Visualizations
│   ├── data/questions.js  18 Questions
│   └── pages/             UI Pages
│
└── server/                Backend AI
    ├── engines/           8 AI Engines
    ├── services/          Orchestrator
    └── routes/            API
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/data/questions.js` | All 18 questions |
| `src/pages/DataCityPage.jsx` | Main simulation page |
| `server/server.js` | Express server |
| `server/services/analysis.service.js` | AI pipeline |

---

## API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/analyze/health
```

### Analyze Performance
```bash
POST http://localhost:5000/api/analyze
Content-Type: application/json

{
  "userId": "user-123",
  "questionId": "array-traversal",
  "timeTaken": 45,
  "incorrectAttempts": 1
}
```

---

## Districts & Questions

### Array District (4)
- array-traversal
- find-maximum
- bubble-sort
- binary-search

### LinkedList Harbor (6)
- linkedlist-traversal
- linkedlist-find-max
- linkedlist-count-nodes
- linkedlist-search
- doubly-linkedlist-traversal
- circular-linkedlist-traversal

### Stack Tower (4)
- stack-push-pop
- stack-peek
- stack-reverse
- stack-is-empty

### Queue Lane (4)
- queue-enqueue-dequeue
- queue-peek-front
- queue-front-rear
- queue-is-empty

---

## AI Engines

1. **Behavior Tracker** - Performance scoring
2. **Pattern Memory** - Mistake tracking
3. **Predictability Model** - Consistency analysis
4. **Exploitability Index** - Vulnerability calculation
5. **Vulnerability Matrix** - Weakness detection
6. **Strategic Intent** - Strategy selection
7. **Adaptive Trap** - Question recommendation
8. **Hunter Escalation** - Difficulty adjustment

---

## Common Commands

### Development
```bash
npm run dev              # Start frontend
cd server && npm run dev # Start backend with auto-reload
npm run lint             # Check code quality
```

### Testing
```bash
cd server && npm test    # Run AI engine tests
curl localhost:5000/api/analyze/health  # Health check
```

### Build
```bash
npm run build            # Build frontend
npm run preview          # Preview production build
```

---

## Debugging

### Check Backend
```bash
curl http://localhost:5000/api/analyze/health
# Should return: {"status":"healthy"}
```

### Check Frontend
1. Open http://localhost:5173
2. Open console (F12)
3. Solve a question
4. Look for: `[AI Analysis]` log

### Check Integration
1. Solve question
2. Console: `[AI Analysis]` ✓
3. Server: `[AI Analysis] User: ...` ✓

---

## Troubleshooting

### Port Already in Use
```bash
# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Backend Won't Start
```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm start
```

### Frontend Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## File Locations

### Add New Question
`src/data/questions.js`

### Modify Visualization
`src/game/districts/[District]Scene.js`

### Adjust AI Logic
`server/engines/[engine-name].engine.js`

### Change API Routes
`server/routes/analyze.route.js`

---

## Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:5000
```

---

## Performance Metrics

### Analysis Output
- Behavior Score: 0-100
- Exploitability Score: 0-100
- Risk Level: low/moderate/high
- Escalation Stage: 1-5
- Pressure Multiplier: 1.0-2.0

### Strategies
- **support**: Strong performance
- **probe**: Moderate performance
- **exploit**: Weak performance

---

## Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Main project guide |
| `AI_ENGINE_SETUP.md` | Complete AI setup |
| `AI_ENGINE_SUMMARY.md` | Quick AI reference |
| `COMPLETE_PROJECT_STATUS.md` | Full documentation |
| `INTEGRATION_CHECKLIST.md` | Verification steps |
| `QUICK_REFERENCE.md` | This card |

---

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/api/analyze/health
- API: http://localhost:5000/api/analyze

---

## Git Workflow

```bash
git status                    # Check changes
git add .                     # Stage all
git commit -m "message"       # Commit
git push origin main          # Push
```

---

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Deploy with Procfile: web: node server.js
```

---

## Support

### Need Help?
1. Check documentation files
2. Review server logs
3. Check browser console
4. Test health endpoint

### Common Issues
- Backend offline → Start server
- Port conflict → Change port
- CORS error → Check CORS config
- No analysis → Check console

---

**Quick Start: Run `npm run dev` and `cd server && npm start` in separate terminals!** 🚀
