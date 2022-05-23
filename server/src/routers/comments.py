from typing import List

from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, status
from fastapi.exceptions import HTTPException

from auth import get_current_user
from utils import get_db

import crud
import schemas

router = APIRouter(prefix="/comment")


@router.get("/list_by_quote", response_model=List[schemas.Comment])
def list_comments_for_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        return crud.list_comments_for_quote(db, user, quote_id)
    except Exception as err:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err.args)


@router.post("/create", response_model=schemas.Comment)
def create_comment(
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        return crud.create_comment(db, user, comment)
    except Exception as err:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err.args)


@router.put("/delete")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return crud.delete_comment(db, comment_id, user.id)
