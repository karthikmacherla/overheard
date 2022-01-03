from datetime import datetime, timedelta
from typing import Optional

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer

from google.oauth2 import id_token
from google.auth.transport import requests

from auth import *
from schemas import *
from utils import *

# to get a string like this run:
# openssl rand -hex 32

app = FastAPI()
config = get_config()


@app.post("/auth/google")
async def google_login_for_access_token(token: str):
    # attempt to decode
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:

        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(),
            config["GOOGLE_CLIENT_ID"])

        print("hi")
        userid = idinfo['sub']
        user = authenticate_google_user(fake_users_db, userid, idinfo)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
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
        fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
