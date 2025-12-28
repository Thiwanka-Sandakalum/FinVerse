
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings

# Product DB
product_engine = create_engine(getattr(settings, "PRODUCT_DB_URL"), pool_pre_ping=True,connect_args={ "ssl": {"ssl": True}})
ProductSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=product_engine)

# Chat DB
chat_engine = create_engine(getattr(settings, "CHAT_DB_URL"), pool_pre_ping=True,connect_args={ "ssl": {"ssl": True}})
ChatSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=chat_engine)

def get_product_db():
    db = ProductSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_chat_db():
    db = ChatSessionLocal()
    try:
        yield db
    finally:
        db.close()