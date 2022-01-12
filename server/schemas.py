from __future__ import annotations
from typing import List, Optional

from datetime import datetime
from pydantic import BaseModel


class GroupBase(BaseModel):
    group_name: str
    description: str


class GroupCreate(GroupBase):
    pass


class Group(GroupBase):
    owner_id: int
    owner: User
    users: List[User] = []

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class User(UserBase):
    id: int
    name: str
    hashed_password: str
    profile_pic_url: Optional[str] = None
    groups: List[Group] = []

    class Config:
        orm_mode = True


class QuoteBase(BaseModel):
    message: str


class QuoteCreate(QuoteBase):
    pass


class Quote(QuoteBase):
    time: datetime
    likes: int
    group: Group
    creator: User


Group.update_forward_refs()

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
