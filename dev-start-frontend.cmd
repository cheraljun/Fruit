@echo off
cd /d "%~dp0"
cd player-standalone && call npm run build || (pause & exit /b 1)
cd ..\frontend && call npm install || (pause & exit /b 1)
call npm run dev
pause
