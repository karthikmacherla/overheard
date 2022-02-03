import unittest2

import crud

from utils import *


class TestGroup(unittest2.TestCase):
    def setUp(self):
        self.config = get_config()
        self.db = get_db()
        set_up_database()

    def test_create_group(self):
        self.assertIsNotNone(self.db)

        # group =


if __name__ == "__main__":
    unittest2.main()
