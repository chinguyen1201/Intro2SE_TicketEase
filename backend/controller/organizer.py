from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Annotated
from model.dbconfig import SessionDep
from model.models import Event, User, EventSeat, EventOrganizer
from middleware.jwt import (
    get_password_hash, authenticate_user, create_access_token, 
    validate_unique_user, revoke_token, get_current_user, oauth2_scheme
)
from datetime import timedelta, datetime
import logging
from sqlmodel import select

router = APIRouter()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@router.post("/create-event")
async def create_event(event: Event, db: SessionDep):

    if not event.id:
        last_event = db.exec(select(Event).order_by(Event.id.desc())).first()
        event.id = last_event.id + 1 if last_event else 1
    if not event.start_date or not event.end_date:
        raise HTTPException(status_code=400, detail="Start date and end date are required")
    if event.start_date > event.end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date")
    if not event.category_id:
        raise HTTPException(status_code=400, detail="Category is required")
    if not event.organizer_id:
        raise HTTPException(status_code=400, detail="Organizer is required")
    
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.post("/update-event/{event_id}")
async def update_event(event_id: int, event: Event, db: SessionDep):
    db_event = db.exec(select(Event).where(Event.id == event_id)).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db_event.title = event.title
    db_event.description = event.description
    db_event.date = event.date
    db_event.time = event.time
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/event/{event_id}")
async def delete_event(event_id: int, db: SessionDep):
    db_event = db.exec(select(Event).where(Event.id == event_id)).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    return {"detail": "Event deleted successfully"}

@router.get("/events", response_model=list[Event])
async def get_events(db: SessionDep, user: User = Depends(get_current_user)):
    events = db.exec(select(Event).where(Event.censored_status == "Accepted" or Event.organizer_id == user.id)).all()
    return events
