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


@router.get("/events")
async def get_events(db: SessionDep):
    events = db.exec(select(Event)).all()
    return events

@router.post("/censor-event")
async def censor_event(event_id: Annotated[int, Query()], censor_val: Annotated[str, Query()], db: SessionDep):

    event = db.exec(select(Event).where(Event.id == event_id)).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.censored_status = censor_val

    if censor_val:
        event.censor_reason = censor_val
    else:
        raise HTTPException(status_code=400, detail="Censor value cannot be empty")
    
    event.censored_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if event.censored_status == "Approved":
        for i in range(ord("A"), ord("H")):
            for j in range(1, 11):
                seat_number = f"{chr(i)}{j}"
                seat = EventSeat(
                    event_id=event.id,
                    user_id=None,
                    seat_number=seat_number,
                    status="available"
        )
                db.add(seat)

    db.add(event)
    db.commit()
    return {"message": "Event censored successfully"}
