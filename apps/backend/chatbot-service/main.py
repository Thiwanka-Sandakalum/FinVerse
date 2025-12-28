from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from api import chat, product_chat, compare
import os

app = FastAPI(title="FinVerse Chatbot MVP")

# Mount static folder (optional for serving CSS/JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include API routers
app.include_router(chat.router, prefix="/chat")
app.include_router(product_chat.router, prefix="/product-chat")
app.include_router(compare.router, prefix="/compare-products")

# Root endpoint serves index.html
@app.get("/", response_class=FileResponse)
def root():
    return os.path.join("static", "index.html")
