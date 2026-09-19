import os

from datetime import datetime, timedelta, timezone

import jwt

from dotenv import load_dotenv

from fastapi import (
    Cookie,
    Depends,
    HTTPException,
    status
)

from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from database import get_db

import models


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()


def get_secret_key() -> str:

    secret_key = os.getenv(
        "JWT_SECRET_KEY"
    )

    if not secret_key:

        raise RuntimeError(
            "JWT_SECRET_KEY is not configured"
        )

    return secret_key


SECRET_KEY: str = get_secret_key()

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ============================================================
# PASSWORD HASHING
# ============================================================

password_hash = PasswordHash.recommended()


def hash_password(
    password: str
) -> str:

    return password_hash.hash(
        password
    )


# ============================================================
# VERIFY PASSWORD
# ============================================================

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return password_hash.verify(
        plain_password,
        hashed_password
    )


# ============================================================
# CREATE JWT
# ============================================================

def create_access_token(
    user_id: int
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# ============================================================
# GET CURRENT USER
# ============================================================

def get_current_user(

    access_token: str | None = Cookie(
        default=None
    ),

    db: Session = Depends(get_db)

):

    if not access_token:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:

        payload = jwt.decode(
            access_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication"
            )

        user_id = int(user_id)

    except (
        InvalidTokenError,
        ValueError
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user = (
        db.query(models.User)
        .filter(
            models.User.id == user_id
        )
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user