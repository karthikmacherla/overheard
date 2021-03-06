from __future__ import annotations
from typing import List, Optional
from fastapi import UploadFile

from datetime import datetime
from pydantic import BaseModel


class GroupBase(BaseModel):
    group_name: str
    description: str

    class Config:
        orm_mode = True


class GroupCreate(GroupBase):
    pass


class GroupUpdate(GroupBase):
    id: int


class GroupInfo(BaseModel):
    group_code: str


class GroupID(BaseModel):
    id: int


class Group(GroupUpdate):
    group_code: str
    owner_id: int
    owner: User

    class Config:
        orm_mode = True


class GroupDetailed(Group):
    users: List[User] = []

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    name: Optional[str] = None
    profile_pic_url: Optional[str] = None
    password: str


class User(UserCreate):
    id: int

    class Config:
        orm_mode = True


class UserMetadata(BaseModel):
    quote_count: int
    like_count: int


class QuoteBase(BaseModel):
    message: str


class QuoteCreate(QuoteBase):
    group_id: int
    pass


class Quote(QuoteBase):
    id: int
    time: datetime
    group_id: int
    creator_id: int
    group: GroupBase

    class Config:
        orm_mode = True


class QuoteDetailed(Quote):
    likes: int
    comment_count: int
    liked_by_user: bool

    class Config:
        orm_mode = True


class CommentBase(BaseModel):
    message: str


class CommentCreate(CommentBase):
    quote_id: int


class Comment(CommentCreate):
    id: int
    creator: User
    likes: int
    time: datetime

    class Config:
        orm_mode = True


Group.update_forward_refs()
GroupDetailed.update_forward_refs()
# ------------- Auth related classes


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class GoogleInfo(BaseModel):
    email: str
    name: str
    given_name: str
    family_name: str
    picture: Optional[str] = None
    sub: str


class UserRemove(BaseModel):
    user_id: int
    group_id: int


class UserUpdate(BaseModel):
    name: Optional[str] = None
    imageFile: UploadFile | None = None


class UserPassword(BaseModel):
    oldPassword: str
    newPassword: str
