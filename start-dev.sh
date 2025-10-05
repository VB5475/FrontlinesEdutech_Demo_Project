#!/bin/bash

echo "Starting Grid App Development Environment..."
echo

echo "Starting JSON Server..."
cd server
npm install
npm start &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 3

echo "Starting Next.js Client..."
cd ../client
npm run dev &
CLIENT_PID=$!

echo "Both servers are starting..."
echo "JSON Server: Check .env file for configuration"
echo "Next.js Client: http://localhost:3000"
echo
echo "Environment variables are loaded from:"
echo "- server/.env"
echo "- client/.env.local"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
