from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError

from fastapi import status
from fastapi.exceptions import HTTPException
from typing import Optional

import models
import schemas
import random
import string
from datetime import datetime
from utils import get_hash_from_str, create_logger, verify_password

logger = create_logger(__name__)


# CUD group
def create_group(
    db: Session, group_info: schemas.GroupCreate, user: models.User
) -> models.Group:
    try:
        group_code = "".join(
            random.SystemRandom().choice(string.ascii_uppercase + string.digits)
            for _ in range(6)
        )
        db_group = models.Group(
            group_name=group_info.group_name,
            description=group_info.description,
            owner_id=user.id,
            group_code=group_code,
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
    group.description = group_info.description

    db.commit()
    return True


def delete_group(db: Session, group_id: int):
    group = db.query(models.Group).get(group_id)

    if group:
        db.query(models.Quote).filter(models.Quote.group_id == group_id).delete()
        db.delete(group)
        db.commit()
        return True
    else:
        return False


def add_to_group_by_code(db: Session, group_code: str, user: models.User):
    user = get_user_by_id(db, user.id)
    group = db.query(models.Group).filter(models.Group.group_code == group_code).first()
    if not group:
        return

    if user not in group.users:
        statement = models.association_table.insert().values(
            user_id=user.id, group_id=group.id
        )
        db.execute(statement)
        db.commit()
    return group


def list_users_in_group(db: Session, group_id: int, user: models.User):
    group = db.query(models.Group).get(group_id)
    if not group:
        raise Exception("group does not exist")

    users = group.users
    user_ids = {u.id for u in users}
    if user.id not in user_ids:
        raise Exception("user not in group")

    return users


def remove_user_from_group(db: Session, user: models.User, group_id: int, user_id: int):
    group = db.query(models.Group).get(group_id)

    if not group:
        raise Exception("group does not exist")

    if user.id != group.owner_id:
        raise Exception("user cannot remove other users")

    users = group.users
    remove_user = next((u for u in users if u.id == user_id), None)
    if not remove_user:
        raise Exception("user not in group list")

    group.users.remove(remove_user)
    db.commit()
    return True


def list_groups(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Group).offset(skip).limit(limit).all()


def list_groups_for_user(
    db: Session, user: models.User, skip: int = 0, limit: int = 10
):
    user = get_user_by_id(db, user.id)
    return user.groups


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
        group.users.append(user)
        db.session.commit()
    return group


# CRUD comments of quote
def create_quote(db: Session, quote: schemas.QuoteCreate, user_id: int):
    try:
        db_quote = models.Quote(
            message=quote.message,
            group_id=quote.group_id,
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


def get_quote(db: Session, quote_id: int) -> models.Quote:
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        return None
    return quote


def get_quote_detailed(
    db: Session, quote_id: int, user_id: int
) -> schemas.QuoteDetailed:
    quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not quote:
        return None

    like_count = (
        db.query(models.QuoteLike).filter(models.QuoteLike.quote_id == quote_id).count()
    )

    comment_count = (
        db.query(models.Comment).filter(models.Comment.quote_id == quote_id).count()
    )

    liked_by_user = (
        db.query(models.QuoteLike)
        .filter(
            models.QuoteLike.quote_id == quote_id
            and models.QuoteLike.user_id == user_id
        )
        .count()
    )

    quote.likes = like_count
    quote.comment_count = comment_count
    quote.liked_by_user = liked_by_user >= 1
    return quote


def update_quote(db: Session, quote_id: int, quote: schemas.QuoteCreate):
    db_quote = get_quote(db, quote_id)
    if not db_quote:
        return False

    db_quote.message = quote.message
    db.commit()
    return True


def delete_quote(db: Session, quote_id: int, user_id: int) -> bool:
    db_quote = get_quote(db, quote_id)
    if not db_quote:
        return False

    if not db_quote.creator_id == user_id:
        raise Exception("user not owner of quote")

    db.delete(db_quote)
    db.commit()
    return True


# CRUD Likes
def like_quote(db: Session, quote_id: int, user_id: int) -> bool:
    try:
        db_like = models.QuoteLike(quote_id=quote_id, user_id=user_id)
        db.add(db_like)
        db.commit()
        return True
    except IntegrityError as err:
        db.rollback()
        return False


def unlike_quote(db: Session, quote_id: int, user_id: int) -> bool:
    try:
        db_like = (
            db.query(models.QuoteLike)
            .filter(
                models.QuoteLike.quote_id == quote_id
                and models.QuoteLike.user_id == user_id
            )
            .first()
        )
        db.delete(db_like)
        db.commit()
        return True
    except IntegrityError as err:
        db.rollback()
        return False


# CRUD comments
def get_comment(db: Session, comment_id: int) -> models.Comment:
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        return
    return comment


def create_comment(
    db: Session, user: models.User, comment: schemas.CommentCreate
) -> models.Comment:
    try:
        if not user_can_access_quote(db, user, comment.quote_id):
            raise Exception("user can't access quote")

        db_comment = models.Comment(
            message=comment.message,
            likes=0,
            time=datetime.now(),
            creator_id=user.id,
            quote_id=comment.quote_id,
        )

        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    except IntegrityError as err:
        db.rollback()
        raise err


def update_comment(
    db: Session, comment: schemas.CommentCreate, comment_id: id
) -> models.Comment:
    db_comment = get_comment(db, comment_id)
    if not db_comment:
        return False

    db_comment.message = comment.message
    db.commit()
    return True


def delete_comment(db: Session, comment_id: id, user_id: int) -> bool:
    db_comment = get_comment(db, comment_id)
    if not db_comment:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY, "comment doesn't exist"
        )

    if not db_comment.creator_id == user_id:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY, "user not owner of comment"
        )

    db.delete(db_comment)
    db.commit()
    return True


def list_comments_for_quote(db: Session, user: models.User, quote_id: int, limit=100):
    if not user_can_access_quote(db, user, quote_id):
        raise Exception("user can't access quote comments")
    return (
        db.query(models.Comment)
        .filter(models.Comment.quote_id == quote_id)
        .limit(limit)
        .all()
    )


def user_can_access_quote(db: Session, user: models.User, quote_id: int):
    quote = get_quote(db, quote_id)
    user = get_user_by_id(db, user.id)
    return quote and user_in_group(user, quote.group_id)


# CRUD Users
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


def update_user(
    db: Session, user: models.User, name: Optional[str], profile_pic_url: Optional[str]
) -> models.User:
    user = get_user_by_id(db, user.id)
    if name:
        user.name = name
    if profile_pic_url:
        user.profile_pic_url = profile_pic_url
    db.commit()
    db.refresh(user)
    return user


def user_in_group(user: models.User, group_id: int) -> bool:
    groups = {g.id for g in user.groups}
    return group_id in groups


def get_user_metadata(db: Session, user: models.User):
    quote_count = (
        db.query(models.Quote).filter(models.Quote.creator_id == user.id).count()
    )
    like_count = (
        db.query(models.QuoteLike).filter(models.QuoteLike.user_id == user.id).count()
    )
    return schemas.UserMetadata(quote_count=quote_count, like_count=like_count)


def list_quotes_in_group(
    db: Session, group_id: int, user: models.User, limit: int = 100
):
    return (
        db.query(models.Quote)
        .filter(models.Quote.group_id == group_id)
        .limit(limit)
        .all()
    )


def list_quotes_for_user(db: Session, user: models.User, limit: int = 100):
    return (
        db.query(models.Quote)
        .filter(models.Quote.creator_id == user.id)
        .limit(limit)
        .all()
    )


def change_password(db: Session, user: models.User, passwordInfo: schemas.UserPassword):
    # check if old is correct
    if verify_password(passwordInfo.oldPassword, user.password):
        user = get_user_by_id(db, user.id)
        user.password = get_hash_from_str(passwordInfo.newPassword)
        db.commit()
        return True
    else:
        return False
