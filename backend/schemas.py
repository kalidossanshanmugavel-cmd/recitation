from pydantic import (
    BaseModel,
    EmailStr,
    Field
)


# ============================================================
# AUTHENTICATION
# ============================================================

class RegisterRequest(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )


class LoginRequest(BaseModel):

    email: EmailStr

    password: str


class UserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr


    model_config = {
        "from_attributes": True
    }


# ============================================================
# COURSE
# ============================================================

class CourseBase(BaseModel):

    title: str

    description: str

    progress: int = Field(
        default=0,
        ge=0,
        le=100
    )

    lessons: int = Field(
        default=0,
        ge=0
    )


class CourseCreate(CourseBase):
    pass


class CourseUpdate(CourseBase):
    pass


class CourseResponse(CourseBase):

    id: int

    model_config = {
        "from_attributes": True
    }


# ============================================================
# MCQ
# ============================================================

class MCQBase(BaseModel):

    course_id: int

    question: str

    options: list[str]

    answer: str


class MCQCreate(MCQBase):
    pass


class MCQUpdate(MCQBase):
    pass


class MCQResponse(MCQBase):

    id: int

    model_config = {
        "from_attributes": True
    }


# ============================================================
# BULK DELETE
# ============================================================

class BulkDeleteRequest(BaseModel):

    ids: list[int]