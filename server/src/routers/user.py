from typing import Optional
from fastapi import APIRouter, Depends, UploadFile
from auth import get_current_user
from utils import create_logger, get_db
from sqlalchemy.orm import Session
from config import get_config

import schemas
import crud
import models
import boto3
import random
import string


router = APIRouter(prefix="/user")
log = create_logger(__name__)
s3 = boto3.resource("s3")
config = get_config()


@router.get("/", response_model=schemas.User)
def read_user(user=Depends(get_current_user)):
    log.debug("type of user: %s", type(user))
    return user


@router.post("/update", response_model=schemas.User)
async def update_user(
    name: Optional[str] = None,
    imageFile: Optional[UploadFile] = None,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prof_pic_url = user.profile_pic_url
    if imageFile:
        fname = imageFile.filename
        extension = fname.split(".")[1]
        gen_key = "".join(random.choices(string.ascii_lowercase, k=15))
        gen_key += "." + extension
        contents = await imageFile.read()
        res = s3.Bucket(config.s3_bucket_loc).put_object(Key=gen_key, Body=contents)
        if res:
            prof_pic_url = f"https://{config.s3_bucket_loc}.s3.amazonaws.com/{gen_key}"
    user = crud.update_user(db, user, name, prof_pic_url)
    return user
