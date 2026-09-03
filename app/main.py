
from fastapi import FastAPI

from . import auth, models
from .database import engine
from pydantic import BaseModel
from .database import engine

from . import auth

models.Base.metadata.create_all(bind=engine)


from .routers import post, users,vote




app = FastAPI( )
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(post.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(vote.router)



