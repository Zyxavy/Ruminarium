'''
Defines Pydantic models related to JWT auth
'''

from pydantic import BaseModel

#Returned after a successful login
class Token(BaseModel):
    access_token: str
    token_type: str

#Decoded token data, used to extract user identity info
class TokenData(BaseModel):
    user_id: str | None = None
    