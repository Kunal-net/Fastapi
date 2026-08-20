from fastapi import Response, status, HTTPException,Depends, APIRouter
from . import schemas,models
from . import database,utils
from sqlalchemy.orm import Session
from . import auth2
from fastapi.security import OAuth2PasswordRequestForm
from . import schemas

router = APIRouter(tags = ['Authentication'])


@router.post('/login',response_model=schemas.Token)
def login(user_credentials : OAuth2PasswordRequestForm = Depends(),db : Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.username).first()

    if not user :
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN , detail = f'Invalid credentials')

    if not utils.verify(user_credentials.password,user.password):
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN,detail = f'Invalid credentials')

    access_token = auth2.create_jwt_token(data = {"user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}