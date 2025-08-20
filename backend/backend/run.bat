@echo off
cd /d D:\GitHub\Intro2SE_TicketEase\backend\backend
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --host 0.0.0.0 --port 3000
pause

