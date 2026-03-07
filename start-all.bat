@echo off
REM ALGorithia - Start All Servers (Windows)
REM This script starts both frontend and backend servers

echo =================================
echo Starting ALGorithia Platform
echo =================================
echo.

REM Check if node_modules exists in server
if not exist "server\node_modules" (
    echo Installing backend dependencies...
    cd server
    call npm install
    cd ..
    echo Backend dependencies installed
    echo.
)

REM Start backend server in new window
echo Starting AI Engine Server (port 5000)...
start "AI Engine Server" cmd /k "cd server && npm start"
echo Backend server started
echo.

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend server
echo Starting Frontend Server (port 5173)...
npm run dev

pause
