from pydantic import BaseModel
from typing import Optional, Dict

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str

class UserInDB(User):
    hashed_password: str

class Message(BaseModel):
    message: str
    location: Dict
