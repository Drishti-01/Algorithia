🌆 Algorithia — Where Algorithms Come Alive

Algorithia transforms algorithm learning from static diagrams into an interactive world where code becomes a living simulation.

Algorithia is an interactive algorithm learning platform where students write real code and watch it execute step-by-step inside a simulated city of data structures.

Instead of memorizing algorithms from textbooks or watching predefined animations, users experience how algorithms behave in real time through a visual environment called Data City.

🎯 The Problem

Learning Data Structures and Algorithms is one of the biggest challenges for students because:

Algorithms are abstract and difficult to visualize

Most resources rely on static diagrams or pseudocode

Traditional visualizers only show predefined animations

Students rarely see how their own code actually executes

This leads to a gap between understanding algorithm logic and writing correct code.

💡 Our Solution

Algorithia bridges this gap by converting user-written code into a dynamic visual simulation.

The system interprets algorithm logic and maps each operation into actions inside a simulated world.

User Code
   ↓
Execution Parser
   ↓
Execution Trace
   ↓
Simulation Engine
   ↓
Real-Time Visualization

Every comparison, swap, loop iteration, or data structure operation becomes a visual event inside the environment.

This allows learners to see their algorithm thinking in action.

🏙️ Welcome to Data City

Data City is the central environment of Algorithia.

Each data structure exists as a district inside the city, representing how it behaves logically.

District	Concept
Array District	Sequential memory and indexing
LinkedList Harbor	Node connections and traversal
Stack Tower	Last-In-First-Out operations
Queue Lane	First-In-First-Out processing

Each district contains interactive coding challenges that teach algorithmic thinking through visualization.

🎮 Core User Experience

The learning flow in Algorithia is designed as an interactive journey.

Step 1 — Choose a Challenge

Users select a problem from the Question Hub inside a district.

Step 2 — Write Code

Students write their solution inside the Monaco Editor, the same editor used in VS Code.

Step 3 — Run Simulation

The platform parses the code and generates an execution trace.

Step 4 — Watch the Algorithm Execute

The simulation engine visualizes the algorithm line by line inside the environment.

Step 5 — Get Instant Feedback

The system validates the solution and provides AI-powered analysis of performance.

✨ Key Features
🌆 Interactive Data Structure Districts

Explore algorithms inside themed environments representing different data structures.

🧠 Real-Time Code Execution Visualization

Watch your algorithm execute step-by-step with visual feedback.

💻 Professional Code Editor

Powered by Monaco Editor, providing a real coding experience.

🎮 Game Engine Simulation

Algorithms are visualized using Phaser, enabling dynamic animation and interaction.

🤖 AI-Powered Analysis Engine

Background AI system tracks learning patterns and adapts difficulty accordingly.

⚡ Instant Solution Validation

Users receive immediate feedback on correctness and performance.

🧠 Why Algorithia is Different

Traditional algorithm visualizers show predefined animations.

Algorithia instead interprets actual user code.

Traditional Tools	Algorithia
Pre-recorded animations	Real code execution
Static diagrams	Interactive simulation
Passive learning	Active experimentation
No personalization	Adaptive AI feedback

Algorithia transforms algorithms from abstract concepts into observable systems.

🏗️ System Architecture

Algorithia consists of three major layers.

Frontend (React + Phaser)
        ↓
Execution Engine (Code Parser)
        ↓
AI Analysis Engine (Express Backend)
Execution Flow
User writes code
       ↓
Parser identifies operations
       ↓
Execution trace generated
       ↓
Simulation engine maps events
       ↓
Visualization inside Data City

This architecture allows code logic to directly control the simulation.

🛠️ Tech Stack
Frontend
Technology	Purpose
React 19 + Vite	UI architecture and fast development
Phaser 3.90	Game-style visualization engine
Monaco Editor	Code editing environment
Framer Motion	UI animations and transitions
Backend (AI Engine)
Technology	Purpose
Node.js + Express	REST API and analysis engine
AI Analysis Engines	Learning behavior analysis
Adaptive Difficulty	Challenge progression system

The AI system tracks:

solving patterns

attempt frequency

time taken

difficulty adaptation

📁 Project Structure
Algorithia/
│
├── src/                      # Frontend source
│   ├── components/           # React UI components
│   ├── engine/               # Code parser & interpreter
│   ├── game/                 # Phaser simulation scenes
│   │   └── districts/        # Array, LinkedList, Stack, Queue scenes
│   ├── pages/                # Application routes
│   ├── data/                 # Questions and content
│   └── simulation/           # Execution utilities
│
├── server/                   # Backend AI Engine
│   ├── engines/              # AI analysis engines
│   ├── services/             # Analysis orchestration
│   ├── routes/               # API endpoints
│   └── server.js             # Express server
│
├── AI_ENGINE_SETUP.md
├── AI_ENGINE_SUMMARY.md
└── COMPLETE_PROJECT_STATUS.md
🚀 Getting Started
Prerequisites

Node.js 20+

npm 10+

Git

Run Frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
Run Backend AI Engine
cd server
npm install
npm start

Backend runs on:

http://localhost:5000
🧪 Testing
Frontend
npm run dev

Open:

http://localhost:5173
Backend
cd server
npm test

Or manually test:

curl http://localhost:5000/api/analyze/health
📊 Available Districts
Array District

Array Traversal

Find Maximum

Bubble Sort

Binary Search

LinkedList Harbor

Traverse Linked List

Find Maximum

Count Nodes

Search Node

Doubly Linked List

Circular Linked List

Stack Tower

Push and Pop Operations

Peek Operation

Reverse Array

isEmpty Check

Queue Lane

Enqueue and Dequeue

Peek Front

Front and Rear Access

isEmpty Check

🤖 AI Analysis API
POST /api/analyze

Analyze user performance after solving a problem.

Example request:

{
  "userId": "user-123",
  "questionId": "array-traversal",
  "questionCategory": "array",
  "timeTaken": 45,
  "incorrectAttempts": 1,
  "success": true
}

Example response:

{
  "success": true,
  "data": {
    "behavior": { "behaviorScore": 85 },
    "exploitability": { "score": 35, "riskLevel": "low-risk" },
    "strategy": { "strategyType": "support" },
    "nextQuestion": { "id": "bubble-sort" },
    "escalation": { "stage": 2 }
  }
}
🎓 Educational Impact

Algorithia helps students:

✔ Visualize algorithm execution
✔ Understand data structure behavior
✔ Debug step-by-step logic
✔ Improve algorithm intuition
✔ Learn through interaction rather than memorization

🔮 Future Enhancements

Planned expansions include:

Tree and Graph visualization districts

User progress tracking

Performance analytics dashboard

Multiplayer collaborative learning

AI-generated hints

Persistent learning profiles

🤝 Contributors

Drishti

Vaibhavi Jha

Esha

Aditya Garg


🌟 Final Thought

Algorithms shouldn’t just be studied — they should be experienced.

Welcome to Data City. 🏙️
