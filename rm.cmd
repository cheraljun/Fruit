@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 运行清理脚本...
python rm.py
pause

