from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Table
from sqlalchemy.orm import relationship
from database import Base

# Define all SQL related models here
association_table = Table(
    "association",
    Base.metadata,
    Column("user_id", ForeignKey("users.id")),
    Column("group_id", ForeignKey("groups.id")),
)


class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User")
    users = relationship("User", secondary=association_table, back_populates="groups")


# single email. sign up with manual sets a password, otherwise there's a unique one generated
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    profile_pic_url = Column(String, nullable=True)
    name = Column(String, index=True, nullable=True)
    groups = relationship("Group", secondary=association_table, back_populates="users")


class Quotes(Base):
    __tablename__ = "quotes"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    time = Column(DateTime, index=True)
    likes = Column(Integer, index=True)

    group_id = Column(Integer, ForeignKey("groups.id"))
    group = relationship("Group")

    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User")
    # TOOD: geohash


class Comments(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    likes = Column(Integer)

    time = Column(DateTime, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), index=True)
    creator = relationship("User")
    quote_id = Column(Integer, ForeignKey("quotes.id"), index=True)
