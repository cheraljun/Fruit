@echo off
chcp 65001 >nul
cd /d "%~dp0"
set /p confirm=Production config completed? (y/n): 
if /i not "%confirm%"=="y" exit /b
echo Copying backend config...
del /F /Q "backend\.env" 2>nul
copy /Y "backend\production.env.txt" "backend\.env" >nul
echo Copying frontend config...
del /F /Q "frontend\.env" 2>nul
copy /Y "frontend\production.env.txt" "frontend\.env" >nul
echo Config files updated!
cd player-standalone && call npm run build || (pause & exit /b 1)
cd ..\backend && call npm install && call npm run build || (pause & exit /b 1)
cd ..\frontend && call npm install && call npm run build || (pause & exit /b 1)
cd ..\backend && call npm start
pause
