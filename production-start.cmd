@echo off
cd /d "%~dp0"
set /p confirm=Production config completed? (y/n): 
if /i not "%confirm%"=="y" exit /b
copy /Y "backend\后端生产环境env.txt" "backend\.env" >nul
copy /Y "frontend\前端生产环境env.txt" "frontend\.env" >nul
cd shared && call npm install || (pause & exit /b 1)
cd ..\player-standalone && call npm run build || (pause & exit /b 1)
cd ..\backend && call npm install && call npm run build || (pause & exit /b 1)
cd ..\frontend && call npm install && call npm run build || (pause & exit /b 1)
cd ..\backend && call npm start
pause
