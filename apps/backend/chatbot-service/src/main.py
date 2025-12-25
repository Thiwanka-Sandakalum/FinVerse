from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import Any
import logging
import os
from src.routes import router 
from fastapi.responses import JSONResponse
from src.utils.json_utils import CustomJSONEncoder
import json

class CustomJSONResponse(JSONResponse):
    """Custom JSON Response that uses our CustomJSONEncoder to handle Decimal and other special types."""
    def render(self, content: Any) -> bytes:
        return json.dumps(
            content,
            cls=CustomJSONEncoder,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"),
        ).encode("utf-8")

app = FastAPI(title="FinVerse Chatbot API", 
            default_response_class=CustomJSONResponse)
logger = logging.getLogger(__name__)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Mount static files
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Add route for the root path to serve index.html
from fastapi.responses import FileResponse

@app.get("/")
async def read_root():
    return FileResponse(os.path.join(static_dir, "index.html"))



