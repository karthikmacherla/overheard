import colorlog
from datetime import datetime, timedelta
from typing import Optional

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi import Request

from google.oauth2 import id_token
from google.auth.transport import requests

from sqlalchemy.orm import Session

from config import *
from auth import *
from utils import *
import crud
import models
import schemas


set_up_database()
log = create_logger(__name__)
app = FastAPI()
config = get_config()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return RedirectResponse("/docs")


@app.post("/auth/google")
def google_login_for_access_token(token: str):
    # attempt to decode
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:

        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), config["GOOGLE_CLIENT_ID"]
        )

        userid = idinfo["sub"]
        idinfo = schemas.GoogleInfo(
            name=idinfo["name"],
            picture=idinfo["picture"],
            given_name=idinfo["given_name"],
            email=idinfo["email"],
        )

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
        return JSONResponse(
            {"access_token": access_token, "token_type": "bearer"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
    except ValueError:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authentication",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.post("/auth/username-json", response_model=Token)
async def login_for_access_token_json(form_data: UserCreate):
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


@app.post("/auth/username", response_model=Token)
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


@app.get("/user", response_model=schemas.User)
def read_user(db: Session = Depends(get_db), user=Depends(get_current_user)):
    log.debug(f"type of user: {type(user)}")
    return user


@app.post("/group/create", response_model=schemas.Group)
def create_group(
    group_info: schemas.GroupCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    db = db.object_session(user)
    db_group = crud.create_group(db, group_info, user)
    return db_group


@app.post("/group/join", response_model=schemas.Group)
def join_group(
    group_info: schemas.GroupInfo,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    res = crud.add_to_group_by_code(db, group_info.group_code, user)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid group code",
        )
    return res


@app.get("/group/list_all", response_model=List[schemas.GroupDetailed])
def list_group(db: Session = Depends(get_db)):
    return crud.list_groups(db)


@app.get("/group/list_by_user", response_model=List[schemas.GroupDetailed])
def list_groups_for_user(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.list_groups_for_user(db, user)


@app.post("/group/delete", response_model=bool)
def delete_group_by_id(group: schemas.GroupID, db: Session = Depends(get_db)):
    res = crud.delete_group(db, group.id)
    return res


@app.post("/group/remove_user", response_model=bool)
def remove_user_from_group(
    user_group: schemas.UserRemove,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    try:
        res = crud.remove_user_from_group(
            db, user, user_group.group_id, user_group.user_id
        )
        return res
    except Exception as err:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err.args)


@app.get("/group/users", response_model=List[schemas.User])
def get_users_in_group(
    group_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    try:
        res = crud.list_users_in_group(db, group_id, user)
        return res
    except Exception as err:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err.args)


@app.post("/quote/create", response_model=schemas.Quote)
def create_quote(
    quote_info: schemas.QuoteCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    if not crud.user_in_group(user, quote_info.group_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="user not in group",
        )
    db_quote = crud.create_quote(db, quote_info, user.id)
    return db_quote


@app.get("/quote/list_by_group", response_model=List[schemas.Quote])
def list_quotes_for_group(
    group_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if not crud.user_in_group(user, group_id):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="user not in group",
        )
    return crud.list_quotes_in_group(db, group_id, user)


@app.get("/comment/list_by_quote", response_model=List[schemas.Comment])
def list_comments_for_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        return crud.list_comments_for_quote(db, user, quote_id)
    except Exception as err:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err.args)


@app.post("/comment/create", response_model=schemas.Comment)
def create_comment(
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        return crud.create_comment(db, user, comment)
    except Exception as err:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err.args)


@app.put("/comment/delete")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        res = crud.delete_comment(db, comment_id, user.id)
        return res
    except Exception as err:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err.args)
