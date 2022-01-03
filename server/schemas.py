from typing import List, Optional

from datetime import datetime
from pydantic import BaseModel


# class UserBase(BaseModel):
#     email: str


# class UserCreate(UserBase):
#     password: str


# class User(UserBase):
#     id: int
#     name: str
#     groups: List[Group] = []

#     class Config:
#         orm_mode = True


# class GroupBase(BaseModel):
#     group_name: str
#     description: str


# class GroupCreate(GroupBase):
#     pass


# class Group(GroupBase):
#     owner_id: int
#     owner: User
#     users: List[User] = []


# class QuoteBase(BaseModel):
#     message: str


# class QuoteCreate(QuoteBase):
#     pass


# class Quote(QuoteBase):
#     time: datetime
#     likes: int
#     group: Group
#     creator: User


# class ItemBase(BaseModel):
#     title: str
#     description: Optional[str] = None


# class ItemCreate(ItemBase):
#     pass


# class Item(ItemBase):
#     id: int
#     owner_id: int

#     class Config:
#         orm_mode = True


# -------------

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    hashed_password: str
