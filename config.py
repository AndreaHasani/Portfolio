import os
SQLALCHEMY_DATABASE_URI = 'mysql://username:password@localhost/database'
SQLALCHEMY_TRACK_MODIFICATIONS = True
secret_key = os.urandom(24)
# DEBUG = True
SERVER = "andreahasani.com"
# PORT = 8080
SERVER_NAME = SERVER
