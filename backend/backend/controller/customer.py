from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Annotated

from sqlmodel import select
from model.dbconfig import SessionDep
from model.models import User, Event, Order
from middleware.jwt import (
    get_password_hash, authenticate_user, create_access_token, 
    validate_unique_user, revoke_token, get_current_user, oauth2_scheme
)
from datetime import timedelta
import logging

router = APIRouter()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@router.get("/users/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    logger.debug(f"Fetching current user: {current_user.id}")
    return current_user

@router.get("/", response_model=list[Event])
async def browse_events(order: Annotated[str, Query()] = "asc", page: Annotated[int, Query(ge=1)] = 1, \
                     page_size: Annotated[int, Query(ge=1)] = 100, db: SessionDep = None):
    skip = (page - 1) * page_size
    events = db.exec(
        select(Event)
        .order_by(Event.name.asc() if order == "asc" else Event.name.desc())
        .offset(skip).limit(page_size)
    ).all()
    logger.debug(f"Fetching events: {events}")
    return events

@router.get("/search", response_model=list[Event])
async def search_events(query: Annotated[str, Query(min_length=3, max_length=255)], db: SessionDep = None):
    events = db.exec(
        select(Event).where(Event.name.ilike(f"%{query}%"))
    ).all()
    logger.debug(f"Searching events with query '{query}': {events}")
    return events

@router.get("/events/{event_id}", response_model=Event)
async def view_event_detail(event_id: int, db: SessionDep = None):
    event = db.exec(
        select(Event).where(Event.id == event_id)
    ).one_or_none()
    if not event:
        logger.warning(f"Event not found: {event_id}")
        raise HTTPException(status_code=404, detail="Event not found")
    logger.debug(f"Fetching event: {event}")
    return event

@router.post("/order", response_model=list[Event])
async def create_event(order: Order, db: SessionDep = None):
    db.add(order)
    db.commit()
    db.refresh(order)
    logger.debug(f"Creating order: {order}")
    return order

@router.post("/purchase",)

@router.get("/order/{order_id}", response_model=Order)
async def view_order(order_id: int, db: SessionDep = None):
    order = db.exec(
        select(Order).where(Order.id == order_id)
    ).one_or_none()
    if not order:
        logger.warning(f"Order not found: {order_id}")
        raise HTTPException(status_code=404, detail="Order not found")
    logger.debug(f"Fetching order: {order}")
    return order

@router.delete("/order/{order_id}", response_model=Order)
async def delete_order(order_id: int, db: SessionDep = None):
    order = db.exec(
        select(Order).where(Order.id == order_id)
    ).one_or_none()
    if not order:
        logger.warning(f"Order not found: {order_id}")
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    logger.debug(f"Deleting order: {order}")
    return order

@router.get("/orders/{user_id}", response_model=list[Order])
async def view_purchase_history(user_id: int, db: SessionDep = None):
    orders = db.exec(
        select(Order).where(Order.user_id == user_id)
    ).all()
    logger.debug(f"Fetching orders for user {user_id}: {orders}")
    return orders

@router.post("/info", response_model=User)
async def manage_account_info(user: User, current_user: User = Depends(get_current_user), db: SessionDep = None):
    if current_user.id != user.id:
        logger.warning(f"User {current_user.id} attempted to update another user's info")
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.debug(f"Updating user info: {user}")
    return user

