@echo off
echo Starting Grid App Development Environment...
echo.

echo Starting JSON Server...
start "JSON Server" cmd /k "cd server && npm install && npm start"

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Starting Next.js Client...
start "Next.js Client" cmd /k "cd client && npm run dev"

echo Both servers are starting...
echo JSON Server: Check .env file for configuration
echo Next.js Client: http://localhost:3000
echo.
echo Environment variables are loaded from:
echo - server/.env
echo - client/.env.local
echo.
echo Press any key to exit...
pause > nul
