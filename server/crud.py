from sqlalchemy.orm import Session

import models
import schemas
from utils import get_hash_from_str, create_logger


logger = create_logger(__name__)


def get_user(db: Session, user_id: int) -> models.User:
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
        name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# def create_group(db: Session, )
