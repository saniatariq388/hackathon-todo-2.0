@echo off
echo Starting the Todo App Backend Services...
echo.

echo Starting Backend API Server on port 8000...
start cmd /k "cd /d %~dp0 && python -m uv run backend/main.py"

timeout /t 3 /nobreak >nul

echo Starting AI Agent Server on port 8001...
start cmd /k "cd /d %~dp0 && python -m uv run ai-agent/main.py"

timeout /t 3 /nobreak >nul

echo Starting MCP Server...
start cmd /k "cd /d %~dp0 && python -m uv run mcp-server/main.py"

echo.
echo All services started! Check your browsers/terminals.
pause