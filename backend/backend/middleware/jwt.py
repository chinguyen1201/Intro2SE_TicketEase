from datetime import datetime, timedelta, timezone
import logging
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, Query
import jwt  # JWT library
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
import os
from fastapi import status
from sqlmodel import select
from model.dbconfig import SessionDep
from model.models import User, JWT

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.getenv("SECRET_KEY", "QuynhChi123")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user(db: SessionDep, username: str):
    return db.exec(select(User).where(User.username == username)).first()


async def authenticate_user(db: SessionDep, username: str, password: str):
    user = await get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, db: SessionDep, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    jwt_record = JWT(
        user_id=data.get("user_id"),
        token=encoded_jwt,
        expires_at=expire
    )
    db.add(jwt_record)
    db.commit()

    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: SessionDep):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    
    user = await get_user(db, username) 
    if user is None:
        raise credentials_exception
    return user


async def check_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.status != "active":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user


async def check_organizer(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.role != "organizer":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not an organizer")
    return current_user

async def check_admin(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not an admin")
    return current_user

async def validate_unique_user(user: Annotated[User, Query()], db: SessionDep):
    logger = logging.getLogger(__name__)
    existing_user = await get_user(db, user.username)
    if existing_user:
        logger.warning(f"Username already registered: {user.username}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    return user


async def validate_unique_email(user: Annotated[User, Query()], db: SessionDep):
    existing_email = db.exec(select(User).where(User.email == user.email)).first()
    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return user


async def validate_token(token: str, db: SessionDep):
    jwt_token = db.exec(select(JWT).where(JWT.token == token)).first()
    if not jwt_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if jwt_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    return jwt_token


async def revoke_token(token: str, db: SessionDep):
    """Revoke token by token string"""
    jwt_token = db.exec(select(JWT).where(JWT.token == token)).first()
    if not jwt_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    db.delete(jwt_token)
    db.commit()
    return True