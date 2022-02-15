import unittest

import crud
import schemas

from utils import *


class TestUser(unittest.TestCase):
    def setUp(self):
        self.config = get_config()
        self.db = get_db()
        set_up_database()

    def test_create_user(self):
        self.assertIsNotNone(self.db)
        user = schemas.UserCreate(
            email="steve@gmail.com",
            name="Steve Jobs",
            password="steve123",
            profile_pic_url="https://media.istockphoto.com/photos/three-potatoes-picture-id157430678?k=20&m=157430678&s=612x612&w=0&h=dfYLuPYwA50ojI90hZ4jCgKZd5TGnqf24UCVBszoZIA=",
        )

        db_user = crud.create_user(self.db, user)
        self.assertIsNotNone(db_user)
        self.assertEqual(user.email, db_user.email)
        self.assertEqual(user.name, db_user.name)
        self.assertNotEqual(user.password, db_user.password)
        self.assertEqual(user.profile_pic_url, db_user.profile_pic_url)

    def test_create_user_already_exists(self):
        user = schemas.UserCreate(
            email="steve12@gmail.com",
            name="Steve Jobs",
            password="steve123",
            profile_pic_url="https://media.istockphoto.com/photos/three-potatoes-picture-id157430678?k=20&m=157430678&s=612x612&w=0&h=dfYLuPYwA50ojI90hZ4jCgKZd5TGnqf24UCVBszoZIA=",
        )

        user2 = user.copy()
        user2.name = "Potato"

        crud.create_user(self.db, user)
        db_user = crud.create_user(self.db, user2)
        self.assertIsNone(db_user)

    def test_get_user_by_email(self):
        user = schemas.UserCreate(
            email="steve@gmail.com",
            name="Steve Jobs",
            password="steve123",
            profile_pic_url="https://media.istockphoto.com/photos/three-potatoes-picture-id157430678?k=20&m=157430678&s=612x612&w=0&h=dfYLuPYwA50ojI90hZ4jCgKZd5TGnqf24UCVBszoZIA=",
        )
        db_user = crud.get_user_by_email(self.db, "steve@gmail.com")
        self.assertIsNotNone(db_user)
        self.assertEqual(user.email, db_user.email)
        self.assertEqual(user.name, db_user.name)
        self.assertNotEqual(user.password, db_user.password)
        self.assertEqual(user.profile_pic_url, db_user.profile_pic_url)

    def test_get_user_by_email_not_exist(self):
        db_user = crud.get_user_by_email(self.db, "sldjlskjdlkj")
        self.assertIsNone(db_user)

    def test_get_user_by_id_not_exist(self):
        db_user = crud.get_user_by_id(self.db, 124)
        self.assertIsNone(db_user)


def create_test_users_if_not_exists(db):
    test_user1 = schemas.UserCreate(
        email="klskdjl@gmail.com",
        name="Karthik Macherla",
        password="potato123",
    )
    db_user1 = crud.create_user(db, test_user1)
    if not db_user1:
        db_user1 = crud.get_user_by_email(db, test_user1.email)

    test_user2 = schemas.UserCreate(
        email="heyo@gmail.com",
        name="Steve Madden",
        password="potato123",
    )

    db_user2 = crud.get_user_by_email(db, test_user2.email)
    if not db_user2:
        db_user2 = crud.create_user(db, test_user2)

    return db_user1, db_user2


class TestGroup(unittest.TestCase):
    def setUp(self):
        self.config = get_config()
        self.db = get_db()
        set_up_database()
        self.user, self.user2 = create_test_users_if_not_exists(self.db)

    def test_create_group(self):
        self.assertIsNotNone(self.db)
        group_info = schemas.GroupCreate(
            group_name="Penn Masti", description="Co-ed Fusion"
        )
        db_group = crud.create_group(self.db, group_info, self.user)
        self.assertIsNotNone(db_group)
        self.assertEqual(group_info.group_name, db_group.group_name)
        self.assertEqual(group_info.description, db_group.description)
        self.assertTrue(db_group.owner == self.user)
        self.assertTrue(len(db_group.users) == 1)

    def test_delete_group(self):
        group_info = schemas.GroupCreate(
            group_name="Penn DMAK", description="Male Fusion"
        )
        db_group = crud.create_group(self.db, group_info, self.user)
        crud.delete_group(self.db, db_group.id)

    def test_delete_not_exist(self):
        self.assertFalse(crud.delete_group(self.db, 456))

    # def test_add_to_group(self):
    #     group_info = schemas.GroupCreate(
    #         group_name="Penn Masti", description="Co-ed Fusion"
    #     )
    #     db_group = crud.create_group(self.db, group_info, self.user)
    #     crud.add_to_group(self.db, db_group.id, self.user2)

    #     self.assertEqual(len(db_group.users), 2)

    #     self.assertIsNotNone(db_group)


if __name__ == "__main__":
    unittest.main()
