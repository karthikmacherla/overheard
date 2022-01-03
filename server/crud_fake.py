from schemas import *

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def create_user(db, username: str, idinfo):
    db[username] = {
        "username": username,
        "full_name": idinfo["name"],
        "email": idinfo["email"],
        "hashed_password": "lsdkjldskjlk",
        "disabled": False,
    }

    user_dict = db[username]
    return UserInDB(**user_dict)
