from datetime import timedelta

from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from fastapi import Depends, APIRouter, status

from google.oauth2 import id_token
from google.auth.transport import requests

from config import get_config
from auth import (
    authenticate_google_user,
    authenticate_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
)
from utils import get_db, create_logger

import crud
import schemas


router = APIRouter(prefix="/auth")

config = get_config()
log = create_logger(__name__)


@router.post("/google")
def google_login_for_access_token(token: str):
    # attempt to decode
    try:
        # Specify the CLIENT_ID of the router that accesses the backend:

        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), config.google_client_id
        )

        userid = idinfo["sub"]
        idinfo = schemas.GoogleInfo(
            name=idinfo["name"],
            picture=idinfo["picture"],
            given_name=idinfo["given_name"],
            email=idinfo["email"],
        )

        log.info(idinfo)

        user = authenticate_google_user(get_db(), userid, idinfo)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return JSONResponse(
            {"access_token": access_token, "token_type": "bearer"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
    except ValueError as p:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authentication",
            headers={"WWW-Authenticate": "Bearer"},
        ) from p


@router.post("/username-json", response_model=schemas.Token)
async def login_for_access_token_json(form_data: schemas.UserCreate):
    user = authenticate_user(get_db(), form_data.email, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/username", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(get_db(), form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", response_model=schemas.Token)
def signup_for_access_token(form_data: schemas.UserCreate):
    db_inst = get_db()
    user = crud.get_user_by_email(db_inst, form_data.email)

    if user:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="User already exists",
        )
    log.info("User does not exist")
    user = crud.create_user(get_db(), form_data)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
