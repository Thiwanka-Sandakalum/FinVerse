from pymongo import MongoClient
from core.config import settings
import os

def get_mongo_collection():
    mongo_url = os.getenv("MONGODB_URL") or getattr(settings, "MONGODB_URL", None)
    db_name = os.getenv("MONGODB_DB") or getattr(settings, "MONGODB_DB", None)
    collection_name = os.getenv("MONGODB_COLLECTION", "services")
    client = MongoClient(mongo_url)
    db = client[db_name]
    return db[collection_name]
