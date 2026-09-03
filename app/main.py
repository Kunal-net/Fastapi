
from fastapi import FastAPI

from . import auth, models
from .database import engine
from pydantic import BaseModel
from .database import engine
from fastapi.middleware.cors import CORSMiddleware
from . import auth

models.Base.metadata.create_all(bind=engine)


from .routers import post, users,vote


origins = ["https://www.google.com", "https://www.youtube.com", "https://www.facebook.com", "http://localhost:3000", "http://localhost:8000"]

app = FastAPI( )
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(post.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(vote.router)



