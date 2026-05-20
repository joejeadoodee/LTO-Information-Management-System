#!/bin/bash

set -e
echo "db setup"
mariadb -uroot < server-setup.sql

echo "db success"

echo "be setup"
cd server

if [ ! -d "node_modules" ]; then
    echo "installing npm dependencies..."
    npm install
fi

echo "launch be"
npm run dev &
BACKEND_PID=$!
cd ..
echo "fe setup"
cd client

rm -rf node_modules/.cache
rm -rf .vite

if [ ! -d "node_modules" ]; then
    echo "installing npm dependencies..."
    npm install
fi

echo "launch fe"
npm run dev -- --force &
FRONTEND_FE_PID=$!

echo "launch"
sleep 1
echo "running"
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
else
    echo "setup complete, open manually: http://localhost:5173"
fi

trap "kill $BACKEND_PID $FRONTEND_FE_PID" EXIT
wait