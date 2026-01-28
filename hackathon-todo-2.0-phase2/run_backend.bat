@echo off
set PYTHONPATH=%~dp0;%PYTHONPATH%
cd /d "C:\Users\syedn\OneDrive\Desktop\hackathon\hackathon-todo-2.0-phase2"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload