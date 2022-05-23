from fastapi import APIRouter, Depends
from auth import get_current_user
from utils import create_logger

import schemas

router = APIRouter(prefix="/user")
log = create_logger(__name__)


@router.get("/user", response_model=schemas.User)
def read_user(user=Depends(get_current_user)):
    log.debug("type of user: %s", type(user))
    return user
