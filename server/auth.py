from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, FastAPI, HTTPException, status
from jose import JWTError, jwt

from sqlalchemy.orm import Session

from datetime import datetime, timedelta
from typing import Optional

import crud
import models
import logging

from schemas import *
from utils import *
from config import get_config

config = get_config()
log = create_logger(__name__)

SECRET_KEY = config["JWT_SECRET"]
ALGORITHM = config["ALGORITHMS"]
ACCESS_TOKEN_EXPIRE_MINUTES = int(config["ACCESS_TOKEN_EXPIRE_MINUTES"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/username")


def authenticate_user(db: Session, username: str, password: str) -> models.User:
    user = crud.get_user_by_email(db, username)
    if user and verify_password(password, user.password):
        return user


def authenticate_google_user(
    db: Session, user_id: str, idinfo: GoogleInfo
) -> models.User:
    gen_pwd = get_hash_from_str(user_id)
    user = crud.get_user_by_email(db, username)

    if not user:
        # create the user with idinfo
        userObj = UserCreate(
            email=idinfo.email,
            name=idinfo.name,
            profile_pic_url=idinfo.picture,
            password=gen_pwd,
        )
        user = crud.create_user(db, userObj)
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> models.User:
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
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(get_db(), token_data.username)
    log.debug(f"user {user.email},{user.name}")
    if user is None:
        raise credentials_exception
    return user
