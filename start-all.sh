#!/bin/bash

# ALGorithia - Start All Servers
# This script starts both frontend and backend servers

echo "================================="
echo "Starting ALGorithia Platform"
echo "================================="
echo ""

# Check if node_modules exists in server
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
    echo "✅ Backend dependencies installed"
    echo ""
fi

# Start backend server in background
echo "🚀 Starting AI Engine Server (port 5000)..."
cd server
npm start &
BACKEND_PID=$!
cd ..
echo "✅ Backend server started (PID: $BACKEND_PID)"
echo ""

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🚀 Starting Frontend Server (port 5173)..."
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
