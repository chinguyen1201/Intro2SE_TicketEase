from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import Field, SQLModel
import os

class Category(SQLModel, table=True):
    __tablename__ = "categories"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    description: str = Field(max_length=255)

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=1, primary_key=True)
    username: str = Field(max_length=50, unique=True)
    email: Optional[str] = Field(default=None, max_length=100)
    password: str = Field(max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=20)
    full_name: Optional[str] = Field(default=None, max_length=100)
    dob: Optional[str] = Field(default=None, max_length=10)
    role: str = Field(default="user", max_length=20)  # Default role is 'user'
    gender: Optional[str] = Field(default=None, max_length=10)
    avatar: Optional[str] = Field(default=None, max_length=255)
    status: Optional[str] = Field(default="active", max_length=20)
    created_at: Optional[str] = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    updated_at: Optional[str] = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

class Bank(SQLModel, table=True):
    __tablename__ = "banks"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    short_name: str = Field(max_length=50)

class PaymentMethod(SQLModel, table=True):
    __tablename__ = "payment_method"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    description: str = Field(max_length=255)
    status: str = Field(max_length=20)  # Status of the payment method (e.g., active, inactive)

class EventOrganizer(SQLModel, table=True):
    __tablename__ = "event_organizers"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(default=None, foreign_key="users.id")
    name: str = Field(max_length=255)
    tin: str = Field(max_length=20)  # Tax Identification Number
    bank_id: int = Field(default=None, foreign_key="banks.id")
    payment_method_id: int = Field(default=None, foreign_key="payment_method.id")

class Event(SQLModel, table=True):
    __tablename__ = "events"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    description: str = Field(max_length=255)
    start_date: str = Field(max_length=10)  # Event start date in YYYY-MM-DD format
    end_date: str = Field(max_length=10)  # Event end date in YYYY-MM-DD format
    start_date_time: str = Field(max_length=5)  # Event time in HH:MM format
    end_date_time: str = Field(max_length=5)  # Event time in HH:MM format
    location: str = Field(max_length=255)
    organizer_id: int = Field(default=None, foreign_key="event_organizers.id")
    category_id: int = Field(default=None, foreign_key="categories.id")
    status: str = Field(max_length=20)  # Status of the event (e.g., upcoming, ongoing, completed)
    censored_status: str = Field(default="Pending")  # Indicates if the event is censored
    censored_at: str = Field(default=None)
    created_at: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    updated_at: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

class TicketClass(SQLModel, table=True):
    __tablename__ = "ticket_classes"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    event_id: int = Field(default=None, foreign_key="events.id")
    name: str = Field(max_length=255)
    description: str = Field(max_length=255)
    price: float = Field(default=0.0)
    quantity: int = Field(default=0)
    sales_start_time: str = Field(max_length=10)  # Sales start date in YYYY-MM-DD format
    sales_end_time: str = Field(max_length=10)  # Sales end date in YYYY-MM-DD format
    status: str = Field(max_length=20)  # Status of the ticket class (e.g., available, sold out)

class Ticket(SQLModel, table=True):
    __tablename__ = "tickets"  # Tên bảng tùy chỉnh
    ticket_id: int = Field(default=None, primary_key=True)
    ticket_class_id: int = Field(default=None, foreign_key="ticket_classes.id")
    order_id: int = Field(default=None, foreign_key="orders.id")
    user_id: int = Field(default=None, foreign_key="users.id")
    seat_id: int = Field(default=None, foreign_key="event_seats.id")

class Order(SQLModel, table=True):
    __tablename__ = "orders"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(default=None, foreign_key="users.id")
    payment_method_id: int = Field(default=None, foreign_key="payment_method.id")
    total_amount: float = Field(default=0.0)
    status: str = Field(max_length=20)  # Status of the order (e.g., pending, completed)

class JWT(SQLModel, table=True):
    __tablename__ = "jwt_tokens"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(default=None, foreign_key="users.id")
    token: str = Field(max_length=500)
    created_at: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    expires_at: str = Field(default_factory=lambda: (datetime.now() + timedelta(minutes=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))).strftime("%Y-%m-%d %H:%M:%S"))

class EventSeat(SQLModel, table=True):
    __tablename__ = "event_seats"  # Tên bảng tùy chỉnh
    id: int = Field(default=None, primary_key=True)
    event_id: int = Field(default=None, foreign_key="events.id")
    user_id: int = Field(default=None, foreign_key="users.id")
    seat_number: str = Field(max_length=10)
    status: str = Field(max_length=20)  # Status of the seat (e.g., available, booked)
