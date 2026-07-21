from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import jwt, JWTError

from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..security import get_password_hash, verify_password, create_access_token
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "IndusMind API server online"}

@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email address already exists in the system.",
        )
    
    hashed_password = get_password_hash(user_in.password)
    db_user = models.User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role,
        is_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(subject=db_user.email)
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user:
        # Create a default user in DB if email is standard sandbox email to allow immediate logon
        if credentials.email in ["manager@indusmind.ai", "maint@indusmind.ai", "safety@indusmind.ai", "quality@indusmind.ai"]:
            hashed_pwd = get_password_hash("password123")
            user = models.User(
                name=credentials.email.split("@")[0].upper(),
                email=credentials.email,
                hashed_password=hashed_pwd,
                role=credentials.role,
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(
                status_code=400, detail="Incorrect email coordinates or operational role."
            )
            
    if not verify_password(credentials.password, user.hashed_password):
         raise HTTPException(
            status_code=400, detail="Incorrect password credentials."
        )
        
    # Sync requested role for testing sandbox purposes
    if user.role != credentials.role:
        user.role = credentials.role
        db.commit()
        db.refresh(user)

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer", "user": user}
