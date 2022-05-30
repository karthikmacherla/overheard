from passlib.context import CryptContext
import logging
import sys
import models
from database import engine, SessionLocal
from config import get_config

config = get_config()

logging.root.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(levelname)s: %(name)s: line %(lineno)s, %(message)s")

file_handler = logging.FileHandler(config.log_loc)
file_handler.setFormatter(formatter)
file_handler.setLevel(6999)

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)


def create_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    return logger


log = create_logger(__name__)

""" 
password hashing + verification

"""
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_hash_from_str(s: str):
    return pwd_context.hash(s)


"""DB contacts
"""


def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()


def set_up_database():
    models.Base.metadata.create_all(bind=engine)
