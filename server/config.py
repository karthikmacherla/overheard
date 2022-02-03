import os
from configparser import ConfigParser

config_obj = None


def get_config():
    """Sets up configuration for the app"""
    global config_obj
    if config_obj:
        return config_obj

    fname = ".config"
    env = os.getenv("ENV", fname)
    config_parsed = ConfigParser()
    config_parsed.read(fname)
    config = config_parsed["AUTH"]
    config.update(config_parsed["DB"])
    config_obj = config
    return config
