from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from config import get_config
from utils import create_logger
from routers import groups, comments, quotes, auth, user
from database import engine

import models

log = create_logger(__name__)
config = get_config()

# set up database
# models.Base.metadata.create_all(bind=engine)

# set up app
app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes
app.include_router(groups.router, tags=["groups"])
app.include_router(comments.router, tags=["comments"])
app.include_router(quotes.router, tags=["quotes"])
app.include_router(auth.router, tags=["auth"])
app.include_router(user.router, tags=["user"])


# all misc routes
@app.get("/")
def root():
    return RedirectResponse("/docs")
