@echo off
call .venv\Scripts\activate
uvicorn app:app --reload --host 0.0.0.0 --port 3000
pause