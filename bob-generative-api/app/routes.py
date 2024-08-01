from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .models import Message, User, Token
from .auth_service import AuthService
from .config import ACCESS_TOKEN_EXPIRE_MINUTES
from .database import fake_users_db
from datetime import datetime, timedelta
from .gen_ai import generate_description 

auth_service = AuthService()
router = APIRouter()

@router.post("/login/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = auth_service.authenticate_user(fake_users_db, form_data.username, form_data.password)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth_service.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as e:
        print(e)
        raise
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error during login")

@router.post("/api/bob-genai")
async def chat(message: Message, current_user: User = Depends(auth_service.get_current_user)):
    try:
        reply = generate_description(message.message, location=message.location)
        return {"answer": reply}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error generating description")
