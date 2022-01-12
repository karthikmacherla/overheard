from passlib.context import CryptContext
import os
import jwt
from configparser import ConfigParser
import logging
import sys


logging.basicConfig(filename='server-simplified.log',
                    encoding='utf-8', level=logging.DEBUG)

formatter = logging.Formatter(
    '%(levelname)s: %(name)s: line %(lineno)s, %(message)s')

file_handler = logging.FileHandler("server.log")
file_handler.setFormatter(formatter)
file_handler.setLevel(logging.DEBUG)


console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)


def create_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    return logger


def get_config():
    """Sets up configuration for the app"""
    env = os.getenv("ENV", ".config")

    if env == ".config":
        config = ConfigParser()
        config.read(".config")
        config = config["AUTH"]
    else:
        config = {
            "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", "<your-google-client-id>"),
            "JWT_SECRET": os.getenv("JWT_SECRET", "<your-jwt-secret>"),
            "ALGORITHMS": os.getenv("ALGORITHMS", "HS256"),
            "ACCESS_TOKEN_EXPIRE_MINUTES": os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
        }
    return config


""" 
password hashing + verification

"""
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_hash_from_str(s: str):
    return pwd_context.hash(s)
