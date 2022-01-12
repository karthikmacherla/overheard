from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, FastAPI, HTTPException, status
from jose import JWTError, jwt

from datetime import datetime, timedelta
from typing import Optional

import crud

from schemas import *
from utils import *

config = get_config()

SECRET_KEY = config["JWT_SECRET"]
ALGORITHM = config["ALGORITHMS"]
ACCESS_TOKEN_EXPIRE_MINUTES = config["ACCESS_TOKEN_EXPIRE_MINUTES"]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/username")


def authenticate_user(db, username: str, password: str):
    user = crud.get_user_by_email(db, username)

    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def authenticate_google_user(db, user_id: str, idinfo):
    username = get_hash_from_str(user_id)
    user = crud.get_user_by_email(db, username)
    if not user:
        # create the user with idinfo
        userObj = User(name=idinfo["name"])
        user = crud.create_user(db, username, idinfo)
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


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud_fake.get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user
