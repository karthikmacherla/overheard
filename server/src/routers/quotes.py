from typing import List

from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, status
from fastapi.exceptions import HTTPException

from auth import get_current_user
from utils import get_db

import crud
import schemas
import models

router = APIRouter(prefix="/quote")


@router.post("/create", response_model=schemas.Quote)
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


@router.get("/list_by_group", response_model=List[schemas.Quote])
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


@router.get("/list_by_user", response_model=List[schemas.Quote])
def list_quotes_for_user(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return crud.list_quotes_for_user(db, user)


@router.get("/", response_model=schemas.QuoteDetailed)
def get_quote_by_id(
    id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    return crud.get_quote_detailed(db, id, user.id)


@router.get("/metadata", response_model=schemas.QuoteDetailed)
def get_metadata(
    id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    return crud.get_quote_detailed(db, id, user.id)


@router.post("/like", response_model=bool)
def like_quote(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return crud.like_quote(db, id, user.id)


@router.post("/unlike", response_model=bool)
def unlike_quote(
    id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    return crud.unlike_quote(db, id, user.id)


@router.post("/update", response_model=bool)
def update_quote(
    id: int,
    message: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return crud.update_quote(db, id, message, user)
