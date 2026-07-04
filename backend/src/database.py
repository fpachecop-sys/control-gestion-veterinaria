import os
import mysql.connector.pooling
from dotenv import load_dotenv

load_dotenv()

dbconfig = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}

pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="vet_pool",
    pool_size=10,
    ssl_disabled=False,
    ssl_verify_cert=False,
    ssl_verify_identity=False,
    **dbconfig,
)


def get_connection():
    return pool.get_connection()