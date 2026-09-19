@echo off
echo ========================================================
echo   Starting TalentLens Unified Server (Backend & Frontend)
echo ========================================================

start "TalentLens Backend" cmd /k "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload --app-dir backend"
start "TalentLens Frontend" cmd /k "cd frontend && node ./node_modules/vite/bin/vite.js --port 5173"

echo [SUCCESS] Backend running at http://127.0.0.1:8000
echo [SUCCESS] Frontend running at http://localhost:5173
