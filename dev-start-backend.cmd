@echo off
cd /d "%~dp0\backend"
call npm install || (pause & exit /b 1)
call npm run dev
pause
