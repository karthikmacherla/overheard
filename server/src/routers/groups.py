from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException

from sqlalchemy.orm import Session
from typing import List

from auth import get_current_user
from utils import *
import crud, models, schemas

router = APIRouter(
    prefix="/group",
)


@router.get("/", response_model=schemas.GroupDetailed)
def get_group(
    id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    group = crud.get_group(db, id)
    return group


@router.post("/create", response_model=schemas.Group)
def create_group(
    group_info: schemas.GroupCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    db = db.object_session(user)
    db_group = crud.create_group(db, group_info, user)
    return db_group


@router.post("/join", response_model=schemas.Group)
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


@router.get("/list_all", response_model=List[schemas.GroupDetailed])
def list_group(db: Session = Depends(get_db)):
    return crud.list_groups(db)


@router.get("/list_by_user", response_model=List[schemas.GroupDetailed])
def list_groups_for_user(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.list_groups_for_user(db, user)


@router.post("/delete", response_model=bool)
def delete_group_by_id(group: schemas.GroupID, db: Session = Depends(get_db)):
    res = crud.delete_group(db, group.id)
    return res


@router.post("/remove_user", response_model=bool)
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


@router.get("/users", response_model=List[schemas.User])
def get_users_in_group(
    group_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    try:
        res = crud.list_users_in_group(db, group_id, user)
        return res
    except Exception as err:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=err.args)
