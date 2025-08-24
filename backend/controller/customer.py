from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Annotated, List
from pydantic import BaseModel

from sqlmodel import select
from model.dbconfig import SessionDep
from model.models import Ticket, TicketClass, User, Event, Order, PaymentMethod
from middleware.jwt import (
    get_password_hash, authenticate_user, create_access_token, 
    validate_unique_user, revoke_token, get_current_user, oauth2_scheme
)
from datetime import datetime, timedelta
import logging

router = APIRouter()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Pydantic models for request/response
class TicketCreate(BaseModel):
    ticket_class_id: int
    quantity: int
    seat_ids: List[int | None] = []  # Optional seat IDs - allow None values

class OrderCreate(BaseModel):
    event_id: int
    tickets: List[TicketCreate]
    payment_method: str  # 'vnpay', 'momo', 'zalopay', 'visa'
    total_amount: float

class OrderResponse(BaseModel):
    id: int
    user_id: int
    payment_method_id: int
    total_amount: float
    status: str
    tickets: List[Ticket] = []

@router.get("/profile", response_model=User)
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

@router.post("/order", response_model=OrderResponse)
async def create_order(order_data: OrderCreate, current_user: User = Depends(get_current_user), db: SessionDep = None):
    """Create a new order with tickets"""
    try:
        logger.debug(f"Creating order for user {current_user.id} with data: {order_data}")
        
        # Validate event exists
        event = db.exec(
            select(Event).where(Event.id == order_data.event_id)
        ).one_or_none()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        logger.debug(f"Found event: {event.id}")
        
        # Get payment method ID
        payment_method = db.exec(
            select(PaymentMethod).where(PaymentMethod.name.ilike(f"%{order_data.payment_method}%"))
        ).first()
        if not payment_method:
            # Create default payment method if not exists
            logger.debug(f"Creating new payment method: {order_data.payment_method}")
            payment_method = PaymentMethod(
                name=order_data.payment_method.upper(),
                description=f"Payment via {order_data.payment_method.upper()}",
                status="active"
            )
            db.add(payment_method)
            db.commit()
            db.refresh(payment_method)

        logger.debug(f"Payment method: {payment_method.id} - {payment_method.name}")

        # Create order
        new_order = Order(
            user_id=current_user.id,
            payment_method_id=payment_method.id,
            total_amount=order_data.total_amount,
            status="pending"
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        logger.debug(f"Created order: {new_order.id}")
        
        # Create tickets
        created_tickets = []
        for ticket_data in order_data.tickets:
            logger.debug(f"Processing ticket data: {ticket_data}")
            
            # Validate ticket class exists
            ticket_class = db.exec(
                select(TicketClass).where(TicketClass.id == ticket_data.ticket_class_id)
            ).one_or_none()
            if not ticket_class:
                raise HTTPException(status_code=404, detail=f"Ticket class {ticket_data.ticket_class_id} not found")
            
            logger.debug(f"Found ticket class: {ticket_class.id} - {ticket_class.name}")
            
            # Create tickets based on quantity
            for i in range(ticket_data.quantity):
                seat_id = None
                if ticket_data.seat_ids and i < len(ticket_data.seat_ids):
                    seat_id = ticket_data.seat_ids[i]
                
                logger.debug(f"Creating ticket {i+1}/{ticket_data.quantity} with seat_id: {seat_id}")
                
                ticket = Ticket(
                    ticket_class_id=ticket_data.ticket_class_id,
                    order_id=new_order.id,
                    user_id=current_user.id,
                    seat_id=seat_id
                )
                db.add(ticket)
                created_tickets.append(ticket)
        
        db.commit()
        
        # Refresh all tickets to get their IDs
        for ticket in created_tickets:
            db.refresh(ticket)
        
        logger.debug(f"Created order {new_order.id} with {len(created_tickets)} tickets")
        
        return OrderResponse(
            id=new_order.id,
            user_id=new_order.user_id,
            payment_method_id=new_order.payment_method_id,
            total_amount=new_order.total_amount,
            status=new_order.status,
            tickets=created_tickets
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating order: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")

@router.put("/order/{order_id}/complete")
async def complete_payment(order_id: int, current_user: User = Depends(get_current_user), db: SessionDep = None):
    """Mark order as completed after successful payment"""
    order = db.exec(
        select(Order).where((Order.id == order_id) & (Order.user_id == current_user.id))
    ).one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status == "completed":
        raise HTTPException(status_code=400, detail="Order already completed")
    
    order.status = "completed"
    db.add(order)
    db.commit()
    db.refresh(order)
    
    logger.debug(f"Completed order: {order_id}")
    return {"message": "Order completed successfully", "order_id": order_id}

@router.post("/purchase", response_model=Order)
async def purchase_event(event_id: int, current_user: User = Depends(get_current_user), db: SessionDep = None):
    event = db.exec(
        select(Event).where(Event.id == event_id)
    ).one_or_none()
    if not event:
        logger.warning(f"Event not found: {event_id}")
        raise HTTPException(status_code=404, detail="Event not found")

    order = Order(user_id=current_user.id, event_id=event.id)
    db.add(order)
    db.commit()
    db.refresh(order)
    logger.debug(f"Creating order: {order}")
    return order

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

@router.get("/orders/{user_id}")
async def view_purchase_history(user_id: int, db: SessionDep = None):
    # Join orders with related data (events, tickets, payment methods)
    from sqlmodel import join
    
    orders = db.exec(
        select(Order).where(Order.user_id == user_id)
    ).all()
    
    logger.debug(f"Fetching orders for user {user_id}: found {len(orders)} orders")
    
    # Enhance orders with related data
    enhanced_orders = []
    for order in orders:
        # Get related event info
        event = None
        tickets = []
        payment_method_name = "Unknown"
        
        # Get tickets for this order
        order_tickets = db.exec(
            select(Ticket).where(Ticket.order_id == order.id)
        ).all()
        
        # Get event info from first ticket (assuming all tickets in one order are for same event)
        if order_tickets:
            first_ticket = order_tickets[0]
            # Get ticket class to find event
            ticket_class = db.exec(
                select(TicketClass).where(TicketClass.id == first_ticket.ticket_class_id)
            ).first()
            if ticket_class:
                event = db.exec(
                    select(Event).where(Event.id == ticket_class.event_id)
                ).first()
        
        # Get payment method name
        payment_method = db.exec(
            select(PaymentMethod).where(PaymentMethod.id == order.payment_method_id)
        ).first()
        if payment_method:
            payment_method_name = payment_method.name
        
        # Build enhanced order response
        order_dict = {
            "id": order.id,
            "user_id": order.user_id,
            "payment_method_id": order.payment_method_id,
            "payment_method": payment_method_name,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": getattr(order, 'created_at', None),
            "tickets": [
                {
                    "id": t.id,
                    "ticket_class_id": t.ticket_class_id,
                    "price": getattr(t, 'price', 0),
                    "status": getattr(t, 'status', 'active')
                } for t in order_tickets
            ],
            "event": {
                "id": event.id if event else None,
                "title": event.title if event else None,
                "start_date": event.start_date if event else None,
                "end_date": event.end_date if event else None,
                "venue": event.venue if event else None,
                "address": event.address if event else None,
                "image": getattr(event, 'image', None) if event else None
            } if event else None
        }
        enhanced_orders.append(order_dict)
    
    logger.debug(f"Returning {len(enhanced_orders)} enhanced orders")
    return enhanced_orders

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

@router.get("/tickets-classes/{event_id}", response_model=list[TicketClass])
async def view_event_ticket_classes(event_id: int, db: SessionDep = None):
    ticket_classes = db.exec(
        select(TicketClass).where(TicketClass.event_id == event_id)
    ).all()
    if not ticket_classes:
        logger.warning(f"No ticket classes found for event: {event_id}")
        raise HTTPException(status_code=404, detail="No ticket classes found for this event")
    logger.debug(f"Fetching ticket classes for event {event_id}: {ticket_classes}")
    return ticket_classes

@router.get("/tickets/{event_id}", response_model=list[Ticket])
async def view_event_tickets(event_id: int, db: SessionDep = None):
    tickets_classes = db.exec(
        select(TicketClass).where(TicketClass.event_id == event_id)
    ).all()
    if not tickets_classes:
        logger.warning(f"No tickets found for event: {event_id}")
        raise HTTPException(status_code=404, detail="No tickets found for this event")

    tickets = []

    for ticket in tickets_classes:
        ticket = db.exec(
            select(Ticket).where(Ticket.ticket_class_id == ticket.id)
        ).all()
        tickets.extend(ticket)

    logger.debug(f"Fetching tickets for event {event_id}: {tickets_classes}")
    return tickets

@router.post("/test-order-validation")
async def test_order_validation(order_data: OrderCreate):
    """Test order data validation"""
    try:
        logger.debug(f"Received order data: {order_data}")
        logger.debug(f"Order data dict: {order_data.model_dump()}")
        return {"message": "Validation successful", "data": order_data.model_dump()}
    except Exception as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")

@router.post("/test")
async def test_endpoint(db: SessionDep = None):
    
    events = db.exec(select(Event.id)).all()
    tickets_classes = db.exec(
        select(TicketClass)
    ).all()


    #         logger.debug(f"Event: {x}")
    return {"message": "This is a test endpoint", "events": events, "tickets_classes": tickets_classes}
