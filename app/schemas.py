
from pydantic import BaseModel,EmailStr
from datetime import datetime
from typing import Optional



class UserCreate(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    email:EmailStr
    created_at: datetime
    id: int


    class Config:
        from_attributes = True
        
class UserLogin(BaseModel):
    email:EmailStr
    password:str


class PostBase(BaseModel):
    title: str
    content: str
    published: bool = True
   

class PostCreate(PostBase):
    pass

class ResponsePost(PostBase):
    title: str
    content: str
    published: bool
    user_id: int
    user : UserResponse
    class Config:
        from_attributes = True



class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None