import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from model.dbconfig import init_db
from controller.auth import router as auth_router
from controller.customer import router as customer_router
from controller.organizer import router as organizer_router
from controller.admin import router as admin_router
from middleware.jwt import check_admin, check_organizer, get_current_user
from middleware.request_logger import log_requests
from model.models import *

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="Ticket Booking API",
    description="API for ticket booking system",
    version="1.0.0"
)

app.middleware("http")(log_requests)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(customer_router, prefix="/customers", tags=["Customers"])
app.include_router(organizer_router, prefix="/organizers", tags=["Organizers"], dependencies=[Depends(check_organizer)])
app.include_router(admin_router, prefix="/admins", tags=["Admins"], dependencies=[Depends(check_admin)])

@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
async def root():
    return {"message": "Hello World"}
