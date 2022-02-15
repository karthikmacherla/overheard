from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import models
import schemas
from datetime import datetime
from utils import get_hash_from_str, create_logger

logger = create_logger(__name__)


# CUD group


def create_group(
    db: Session, group_info: schemas.GroupCreate, user: models.User
) -> models.Group:
    try:
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
    except IntegrityError:
        db.rollback()
        return None


def update_group(db: Session, group_info: schemas.GroupCreate):
    group = db.query(models.Group).filter(models.Group.id == group_info.id).first()
    if not group:
        return False

    group.group_name = group_info.group_name
    group.description = gorup_info.description

    db.commit()
    return True


def delete_group(db: Session, group_id: int):
    group = db.query(models.Group).get(group_id)
    if group:
        db.delete(group)
        db.commit()
        return True
    else:
        return False


def list_groups(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Group).offset(skip).limit(limit).all()


def get_group(db: Session, group_id: int):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        return None
    users = group.users
    return group


def add_to_group(db: Session, group_id: int, user_to_add: int):
    user = db.query(models.User).filter(models.User.id == user_to_add).first()
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group or not user:
        return False

    if user not in group.users:
        group.users.add(user)
    return True


# CRUD comments of quote
def create_quote(db: Session, quote: schemas.QuoteCreate, group_id: int, user_id: int):
    try:
        db_quote = models.Quotes(
            message=quote.message,
            group_id=group_id,
            creator_id=user_id,
            time=datetime.now(),
            likes=0,
        )
        db.add(db_quote)
        db.commit()
        db.refresh(db_quote)
        return db_quote
    except IntegrityError:
        db.rollback()
        return None


def read_quote(db: Session, quote_id: int) -> models.Quotes:
    quote = db.query(models.Quotes).filter(models.Quotes.id == quote_id).first()
    if not quote:
        return None
    return quote


def update_quote(db: Session, quote_id: int, quote: schemas.QuoteCreate):
    db_quote = read_quote(db, quote_id)
    if not db_quote:
        return False

    db_quote.message = quote.message
    db.commit()
    return True


def delete_quote(db: Session, quote_id: int) -> bool:
    db_quote = read_quote(db, quote_id)
    if not db_quote:
        return False

    db.delete(db_quote)
    db.commit()
    return True


# CRUD comments
def read_comment(db: Session, comment_id: int) -> models.Comments:
    comment = db.query(models.Comments).filter(models.Comments.id == comment_id).first()
    if not comment:
        return
    return comment


def create_comment(
    db: Session, comment: schemas.CommentCreate, user_id: int, quote_id: int
) -> models.Comments:
    try:
        db_comment = models.Comments(
            message=comment.message,
            likes=0,
            time=datetime.now(),
            creator_id=user_id,
            quote_id=quote_id,
        )

        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    except IntegrityError:
        db.rollback()
        return


def update_comment(
    db: Session, comment: schemas.CommentCreate, comment_id: id
) -> models.Comments:
    db_comment = read_comment(db, comment_id)
    if not db_comment:
        return False

    db_comment.message = comment.message
    db.commit()
    return True


def delete_comment(db: Session, comment_id: id) -> bool:
    db_comment = read_quote(db, comment_id)
    if not db_comment:
        return False

    db.delete(db_comment)
    db.commit()
    return True


def get_user_by_id(db: Session, user_id: int) -> models.User:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    return user


def get_user_by_email(db, email: str) -> models.User:
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    try:
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
    except IntegrityError:
        db.rollback()
        return None


# def create_group(db: Session, )


# Special Routes
