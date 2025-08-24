from fastapi import HTTPException
from sqlmodel import select
from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Annotated
from model.models import User, Event, Order, EventOrganizer, TicketClass, Ticket, EventSeat
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

# Complete order endpoint (moved below router initialization)
@router.put("/order/{order_id}/complete")
async def complete_order(order_id: int, db: SessionDep = None):
    order = db.exec(select(Order).where(Order.id == order_id)).one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = "completed"
    db.commit()
    db.refresh(order)
    return order

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


# Enhanced event detail with organizer and ticket classes
@router.get("/events/{event_id}")
async def view_event_detail(event_id: int, db: SessionDep = None):
    event = db.exec(select(Event).where(Event.id == event_id)).one_or_none()
    if not event:
        logger.warning(f"Event not found: {event_id}")
        raise HTTPException(status_code=404, detail="Event not found")

    # Organizer info
    organizer = None
    if event.organizer_id:
        organizer = db.exec(select(EventOrganizer).where(EventOrganizer.id == event.organizer_id)).one_or_none()
        if organizer:
            organizer = {
                "id": organizer.id,
                "name": organizer.name,
                "tin": organizer.tin,
                "user_id": organizer.user_id
            }

    # Ticket classes
    ticket_classes = db.exec(select(TicketClass).where(TicketClass.event_id == event_id)).all()
    ticket_classes_data = [
        {
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "price": t.price,
            "quantity": t.quantity,
            "status": t.status
        } for t in ticket_classes
    ]

    # Return combined event detail
    return {
        "id": event.id,
        "name": event.name,
        "description": event.description,
        "start_date": event.start_date,
        "end_date": event.end_date,
        "start_date_time": event.start_date_time,
        "end_date_time": event.end_date_time,
        "location": event.location,
        "organizer": organizer,
        "category_id": event.category_id,
        "status": event.status,
        "censored_status": event.censored_status,
        "censored_at": event.censored_at,
        "created_at": event.created_at,
        "updated_at": event.updated_at,
        "ticket_classes": ticket_classes_data
    }


# Ticket classes endpoint for event
@router.get("/tickets-classes/{event_id}")
async def get_ticket_classes(event_id: int, db: SessionDep = None):
    ticket_classes = db.exec(select(TicketClass).where(TicketClass.event_id == event_id)).all()
    return [
        {
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "price": t.price,
            "quantity": t.quantity,
            "status": t.status
        } for t in ticket_classes
    ]

from fastapi import Depends
from model.models import User
from middleware.jwt import get_current_user

@router.post("/order", response_model=Order)
async def create_event(order: Order, db: SessionDep = None, current_user: User = Depends(get_current_user)):
    order.user_id = current_user.id
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

@router.get("/orders/{user_id}")
@router.get("/orders/{user_id}", response_model=list[Order])
@router.get("/orders/{user_id}")
async def view_purchase_history(user_id: int, db: SessionDep = None):
    orders = db.exec(select(Order).where(Order.user_id == user_id)).all()
    result = []
    for order in orders:
        # Debug: print all attributes of the order object safely
        try:
            logger.debug(f"Order object vars: {vars(order)}")
        except Exception as e:
            logger.debug(f"Could not log order vars: {e}")
    logger.debug(f"Order ID: {order.id}, event_id: {getattr(order, 'event_id', None)}")
        event = None
        if hasattr(order, 'event_id'):
            event = db.exec(select(Event).where(Event.id == order.event_id)).one_or_none()
            logger.debug(f"  Event found: {event is not None} (event_id: {getattr(order, 'event_id', None)})")
        tickets = db.exec(select(Ticket).where(Ticket.order_id == order.id)).all()
        ticket_list = []
        for ticket in tickets:
            ticket_class = db.exec(select(TicketClass).where(TicketClass.id == ticket.ticket_class_id)).one_or_none()
            seat = db.exec(select(EventSeat).where(EventSeat.id == ticket.seat_id)).one_or_none() if ticket.seat_id else None
            ticket_list.append({
                "ticket_id": ticket.ticket_id,
                "ticket_class": {
                    "id": ticket_class.id if ticket_class else None,
                    "name": ticket_class.name if ticket_class else None,
                    "price": ticket_class.price if ticket_class else None
                } if ticket_class else None,
                "seat": {
                    "id": seat.id,
                    "seat_number": seat.seat_number
                } if seat else None
            })
        result.append({
            "id": order.id,
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "event": {
                "id": event.id if event else None,
                "title": event.name if event else None,
                "image": getattr(event, "image", None),
                "start_date": getattr(event, "start_date", None),
                "start_date_time": getattr(event, "start_date_time", None),
                "end_date": getattr(event, "end_date", None),
                "end_date_time": getattr(event, "end_date_time", None),
                "venue": getattr(event, "location", None),
                "address": getattr(event, "address", None)
            } if event else None,
            "tickets": ticket_list,
            "ticket_count": len(ticket_list)
        })
    logger.debug(f"Fetching orders for user {user_id}: {result}")
    return result

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

