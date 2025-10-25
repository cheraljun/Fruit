@echo off
cd /d "%~dp0\packager"
call npm install || (pause & exit /b 1)
call npm run build
pause
