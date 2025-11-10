@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist "nodejs\node.exe" (
    echo 错误: 找不到 Node.js
    pause
    exit /b 1
)
if not exist "app\launcher.js" (
    echo 错误: 找不到应用文件
    pause
    exit /b 1
)
nodejs\node.exe app\launcher.js
if errorlevel 1 pause

