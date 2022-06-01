from datetime import timedelta

from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from fastapi import Depends, APIRouter, status

from google.oauth2 import id_token
from google_auth_oauthlib import flow
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
import requests


router = APIRouter(prefix="/auth")

config = get_config()
log = create_logger(__name__)


# from_client_secrets_file(
#     CLIENT_SECRETS_FILE, scopes=SCOPES, state=state
# )


@router.post("/google")
def google_login_for_access_token(google_access_token: str):
    # attempt to decode
    try:
        # NEW: get info by making a request using the access_token they gave you
        resp = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {google_access_token}"},
        )

        if resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid google access token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        idinfo = resp.json()

        log.info(idinfo)

        userid = idinfo["email"]
        idinfo = schemas.GoogleInfo(
            name=idinfo["name"],
            picture=idinfo["picture"],
            given_name=idinfo["given_name"],
            family_name=idinfo["family_name"],
            sub=idinfo["sub"],
            email=idinfo["email"],
        )

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
        log.error(p)
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
