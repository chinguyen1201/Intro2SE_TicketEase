from sqlmodel import Session, SQLModel, create_engine
from dotenv import load_dotenv
import os
from typing import Annotated
from fastapi import Depends

load_dotenv()

# Get environment variables - prioritize Docker environment over .env file
DB_HOST = os.environ.get("DB_HOST") or os.getenv("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT") or os.getenv("DB_PORT", "1433")
DB_USER = os.environ.get("DB_USER") or os.getenv("DB_USER", "sa")
DB_PASSWORD = os.environ.get("DB_PASSWORD") or os.getenv("DB_PASSWORD", "QuynhChi123")
DB_NAME = os.environ.get("DB_NAME") or os.getenv("DB_NAME", "TIKET")

# Construct the DATABASE_URL
DATABASE_URL = f"mssql+pyodbc://{DB_USER}:{DB_PASSWORD}@{DB_HOST},{DB_PORT}/{DB_NAME}?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes&Encrypt=no"

print(f"Connecting to: {DATABASE_URL}")  # Hide password

engine = create_engine(DATABASE_URL, echo=True, pool_timeout=20, pool_recycle=-1)

def init_db():
    """Initialize the database and create tables if they do not exist."""
    from model.models import (
        Category,
        User,
        Bank,
        PaymentMethod,
        EventOrganizer,
        Event,
        TicketClass,
        Ticket,
        Order
    )
    SQLModel.metadata.create_all(engine)
    print("✅ All tables created successfully!")

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
