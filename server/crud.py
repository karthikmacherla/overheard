from sqlalchemy.orm import Session

import models
import schemas
from utils import get_hash_from_str, create_logger

logger = create_logger(__name__)


# CUD group


def create_group(db: Session, group_info: schemas.GroupCreate, user: schemas.User):
    user = get_user_by_id(db, user.id)
    db_group = models.Group(
        group_name=group_info.group_name,
        description=group_info.description,
        owner_id=user.id,
        users=[user],
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


def update_group(db: Session, group_info: schemas.GroupCreate):
    group = db.query(models.Group).filter(models.Group.id == group_info.id).first()
    if not group:
        return False

    group.group_name = group_info.group_name
    group.description = gorup_info.description

    db.commit()
    return True


def delete_group(db: Session, group_id: int):
    group = db.query(Group).get(group_id)
    db.delete(group)
    return True


def list_groups(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Group).offset(skip).limit(limit).all()


def get_group(db: Session, group_id: int):
    group = db.query(models.Group).filter(models.Group.id == group_info.id).first()
    if not group:
        return None
    users = group.users
    return group


# CUD comments of quote


def get_user_by_id(db: Session, user_id: int) -> models.User:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    return user


def get_user_by_email(db, email: str) -> models.User:
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_hash_from_str(user.password)
    logger.info(f"User: {user}")
    db_user = models.User(
        email=user.email,
        password=hashed_password,
        profile_pic_url=user.profile_pic_url,
        name=user.name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# def create_group(db: Session, )
