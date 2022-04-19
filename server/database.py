from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import get_config

config = get_config()

SQLALCHEMY_DATABASE_URL = config.database_url
engine = create_engine(
    SQLALCHEMY_DATABASE_URL or "sqlite:///./sql_test_app.db",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
