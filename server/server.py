import colorlog
from datetime import datetime, timedelta
from typing import Optional

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer

from google.oauth2 import id_token
from google.auth.transport import requests

from sqlalchemy.orm import Session

from auth import *
from utils import *
import crud
import models
import schemas
import logging


models.Base.metadata.create_all(bind=engine)


log = create_logger(__name__)
app = FastAPI()
config = get_config()


@app.post("/auth/google")
def google_login_for_access_token(token: str):
    # attempt to decode
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:

        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(),
            config["GOOGLE_CLIENT_ID"])

        userid = idinfo['sub']
        idinfo = schemas.GoogleInfo(name=idinfo["name"],
                                    picture=idinfo["picture"],
                                    given_name=idinfo["given_name"],
                                    email=idinfo["email"])

        log.info(idinfo)

        user = authenticate_google_user(fake_users_db, userid, idinfo)

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
        return JSONResponse({"access_token": access_token, "token_type": "bearer"},
                            headers={'Authorization': f'Bearer {access_token}'})
    except ValueError:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authentication",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.post("/auth/username", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(
        get_db(), form_data.username, form_data.password)

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


@app.post("/auth/signup", response_model=Token)
def signup_for_access_token(form_data: UserCreate):
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


@app.get("/users", response_model=schemas.User)
def read_user(db: Session = Depends(get_db),
              user=Depends(get_current_user)):
    return user
# return user
