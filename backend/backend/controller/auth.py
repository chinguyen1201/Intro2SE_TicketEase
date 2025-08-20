from fastapi import APIRouter, Query, HTTPException, Depends, Body
from typing import Annotated
from model.dbconfig import SessionDep
from model.models import EventOrganizer, User
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

@router.post("/register")
async def register(
    username: Annotated[str, Body()],
    password: Annotated[str, Body()],
    email: Annotated[str, Body()] = None, 
    phone_number: Annotated[str, Body()] = None,
    full_name: Annotated[str, Body()] = None,
    role: Annotated[str, Body()] = "user",
    tin: Annotated[str, Body()] = None,
    db: SessionDep = None
):
    """Register với password hashing"""
    try:
        # Create user object from individual parameters
        user = User(
            username=username,
            email=email,
            password=password,
            phone_number=phone_number,
            full_name=full_name,
            role=role or "user"
        )
        
        await validate_unique_user(user, db)
        user.password = get_password_hash(user.password)
        user.created_at = user.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        user.status = "active"  # Set default status to active
        
        last_user = (db.exec(
            select(User).order_by(User.id.desc()).limit(1)
        ).first())

        last_user_id = last_user.id + 1 if last_user else 1
        user.id = last_user_id

        if user.role not in ["user", "organizer", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid role")

        if user.role == "organizer":
            if not tin:
                raise HTTPException(status_code=400, detail="TIN is required for organizers")
            last_organizer = db.exec(
                select(EventOrganizer).order_by(EventOrganizer.id.desc()).limit(1)
            ).first()
            last_organizer_id = last_organizer.id + 1 if last_organizer else 1
            db_organizer = EventOrganizer(
                id=last_organizer_id,
                user_id=user.id,
                tin=tin
            )
            db.add(db_organizer)

        db.add(user)
        db.commit()
        db.refresh(user)
        return {"message": "User registered successfully", "user_id": user.id}
        
    except Exception as e:
        db.rollback()
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(username: Annotated[str, Query()], password: Annotated[str, Query()], db: SessionDep):
    """Login với JWT token"""
    logger.info(f"Login attempt: username={username}")
    
    try:
        user = await authenticate_user(db, username, password)
        
        if not user:
            raise HTTPException(
                status_code=401, 
                detail="Incorrect username or password"
            )
        
        access_token_expires = timedelta(minutes=60)
        access_token = create_access_token(
            data={"sub": user.username, "user_id": user.id},
            db=db,
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "user_role": user.role
        }
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout(token: Annotated[str, Depends(oauth2_scheme)], db: SessionDep):
    """Logout và revoke token"""
    try:
        await revoke_token(token, db)
        return {"message": "Successfully logged out"}
    except Exception as e:
        logger.error(f"Logout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }