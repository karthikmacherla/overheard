import os
import jwt
from configparser import ConfigParser


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
