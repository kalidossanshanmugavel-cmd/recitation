from typing import List

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    Response,
    status
)

from fastapi.middleware.cors import (
    CORSMiddleware
)

from sqlalchemy.orm import Session

from database import (
    Base,
    engine,
    get_db
)

import models
import schemas

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="Recitation API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# HELPER
# ============================================================

def mcq_to_response(mcq):

    return {

        "id":
            mcq.id,

        "course_id":
            mcq.course_id,

        "question":
            mcq.question,

        "options": [
            option.option_text
            for option
            in mcq.options
        ],

        "answer":
            mcq.answer
    }


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message":
            "Recitation API is running"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# AUTH - REGISTER
# ============================================================

@app.post(
    "/auth/register",
    response_model=
        schemas.UserResponse,
    status_code=
        status.HTTP_201_CREATED
)
def register(

    data:
        schemas.RegisterRequest,

    db: Session =
        Depends(get_db)

):

    email = (
        data.email.lower()
    )


    existing_user = (

        db.query(
            models.User
        )

        .filter(
            models.User.email ==
            email
        )

        .first()
    )


    if existing_user:

        raise HTTPException(
            status_code=400,
            detail=
                "Email already registered"
        )


    user = models.User(

        name=
            data.name.strip(),

        email=
            email,

        password_hash=
            hash_password(
                data.password
            )
    )


    db.add(user)

    db.commit()

    db.refresh(user)


    return user


# ============================================================
# AUTH - LOGIN
# ============================================================

@app.post("/auth/login")
def login(

    data:
        schemas.LoginRequest,

    response: Response,

    db: Session =
        Depends(get_db)

):

    email = (
        data.email.lower()
    )


    user = (

        db.query(
            models.User
        )

        .filter(
            models.User.email ==
            email
        )

        .first()
    )


    if (
        user is None
        or
        not verify_password(
            data.password,
            user.password_hash
        )
    ):

        raise HTTPException(
            status_code=
                status.HTTP_401_UNAUTHORIZED,

            detail=
                "Invalid email or password"
        )


    token = create_access_token(
        user.id
    )


    response.set_cookie(

        key="access_token",

        value=token,

        httponly=True,

        # localhost development
        secure=False,

        samesite="lax",

        max_age=
            ACCESS_TOKEN_EXPIRE_MINUTES
            * 60,

        path="/"
    )


    return {

        "message":
            "Login successful",

        "user": {

            "id":
                user.id,

            "name":
                user.name,

            "email":
                user.email
        }
    }


# ============================================================
# AUTH - CURRENT USER
# ============================================================

@app.get(
    "/auth/me",
    response_model=
        schemas.UserResponse
)
def get_me(

    current_user:
        models.User =
        Depends(
            get_current_user
        )

):

    return current_user


# ============================================================
# AUTH - LOGOUT
# ============================================================

@app.post("/auth/logout")
def logout(
    response: Response
):

    response.delete_cookie(

        key=
            "access_token",

        path="/",

        httponly=True,

        samesite="lax"
    )


    return {
        "message":
            "Logout successful"
    }


# ============================================================
# PROTECTED TEST
# ============================================================

@app.get("/protected")
def protected(

    current_user:
        models.User =
        Depends(
            get_current_user
        )

):

    return {

        "message":
            "Authenticated successfully",

        "user_id":
            current_user.id,

        "name":
            current_user.name
    }


# ============================================================
# COURSE - CREATE
# ============================================================

@app.post(
    "/courses",
    response_model=
        schemas.CourseResponse
)
def create_course(

    course:
        schemas.CourseCreate,

    db: Session =
        Depends(get_db)

):

    new_course = models.Course(

        title=
            course.title,

        description=
            course.description,

        progress=
            course.progress,

        lessons=
            course.lessons
    )


    db.add(new_course)

    db.commit()

    db.refresh(new_course)


    return new_course


# ============================================================
# COURSE - BULK CREATE
# ============================================================

@app.post(
    "/courses/bulk",
    response_model=
        List[
            schemas.CourseResponse
        ]
)
def create_courses_bulk(

    courses:
        List[
            schemas.CourseCreate
        ],

    db: Session =
        Depends(get_db)

):

    new_courses = []


    for course in courses:

        new_course = models.Course(

            title=
                course.title,

            description=
                course.description,

            progress=
                course.progress,

            lessons=
                course.lessons
        )


        new_courses.append(
            new_course
        )


    db.add_all(
        new_courses
    )

    db.commit()


    for course in new_courses:

        db.refresh(
            course
        )


    return new_courses


# ============================================================
# COURSE - GET ALL
# ============================================================

@app.get(
    "/courses",
    response_model=
        List[
            schemas.CourseResponse
        ]
)
def get_courses(

    skip: int = 0,

    limit: int = 100,

    db: Session =
        Depends(get_db)

):

    return (

        db.query(
            models.Course
        )

        .offset(skip)

        .limit(limit)

        .all()
    )


# ============================================================
# COURSE - GET ONE
# ============================================================

@app.get(
    "/courses/{course_id}",
    response_model=
        schemas.CourseResponse
)
def get_course(

    course_id: int,

    db: Session =
        Depends(get_db)

):

    course = (

        db.query(
            models.Course
        )

        .filter(
            models.Course.id ==
            course_id
        )

        .first()
    )


    if course is None:

        raise HTTPException(
            status_code=404,
            detail=
                "Course not found"
        )


    return course


# ============================================================
# COURSE - UPDATE
# ============================================================

@app.put(
    "/courses/{course_id}",
    response_model=
        schemas.CourseResponse
)
def update_course(

    course_id: int,

    course_data:
        schemas.CourseUpdate,

    db: Session =
        Depends(get_db)

):

    course = (

        db.query(
            models.Course
        )

        .filter(
            models.Course.id ==
            course_id
        )

        .first()
    )


    if course is None:

        raise HTTPException(
            status_code=404,
            detail=
                "Course not found"
        )


    course.title = (
        course_data.title
    )

    course.description = (
        course_data.description
    )

    course.progress = (
        course_data.progress
    )

    course.lessons = (
        course_data.lessons
    )


    db.commit()

    db.refresh(course)


    return course


# ============================================================
# COURSE - DELETE
# ============================================================

@app.delete(
    "/courses/{course_id}"
)
def delete_course(

    course_id: int,

    db: Session =
        Depends(get_db)

):

    course = (

        db.query(
            models.Course
        )

        .filter(
            models.Course.id ==
            course_id
        )

        .first()
    )


    if course is None:

        raise HTTPException(
            status_code=404,
            detail=
                "Course not found"
        )


    db.delete(course)

    db.commit()


    return {
        "message":
            "Course deleted successfully"
    }


# ============================================================
# MCQ - CREATE
# ============================================================

@app.post(
    "/mcqs",
    response_model=
        schemas.MCQResponse
)
def create_mcq(

    mcq:
        schemas.MCQCreate,

    db: Session =
        Depends(get_db)

):

    course = (

        db.query(
            models.Course
        )

        .filter(
            models.Course.id ==
            mcq.course_id
        )

        .first()
    )


    if course is None:

        raise HTTPException(
            status_code=404,
            detail=
                "Course not found"
        )


    if mcq.answer not in mcq.options:

        raise HTTPException(
            status_code=400,
            detail=
                "Answer must exist in options"
        )


    new_mcq = models.MCQ(

        course_id=
            mcq.course_id,

        question=
            mcq.question,

        answer=
            mcq.answer
    )


    for option in mcq.options:

        new_mcq.options.append(

            models.MCQOption(
                option_text=
                    option
            )
        )


    db.add(new_mcq)

    db.commit()

    db.refresh(new_mcq)


    return mcq_to_response(
        new_mcq
    )


# ============================================================
# MCQ - BULK CREATE
# ============================================================

@app.post(
    "/mcqs/bulk",
    response_model=
        List[
            schemas.MCQResponse
        ]
)
def create_mcqs_bulk(

    mcqs:
        List[
            schemas.MCQCreate
        ],

    db: Session =
        Depends(get_db)

):

    new_mcqs = []


    for mcq in mcqs:

        course = (

            db.query(
                models.Course
            )

            .filter(
                models.Course.id ==
                mcq.course_id
            )

            .first()
        )


        if course is None:

            raise HTTPException(
                status_code=404,
                detail=
                    f"Course {mcq.course_id} not found"
            )


        if mcq.answer not in mcq.options:

            raise HTTPException(
                status_code=400,
                detail=
                    "Answer must exist in options "
                    f"for question: {mcq.question}"
            )


        new_mcq = models.MCQ(

            course_id=
                mcq.course_id,

            question=
                mcq.question,

            answer=
                mcq.answer
        )


        for option in mcq.options:

            new_mcq.options.append(

                models.MCQOption(
                    option_text=
                        option
                )
            )


        new_mcqs.append(
            new_mcq
        )


    db.add_all(
        new_mcqs
    )

    db.commit()


    for mcq in new_mcqs:

        db.refresh(
            mcq
        )


    return [

        mcq_to_response(
            mcq
        )

        for mcq
        in new_mcqs
    ]


# ============================================================
# MCQ - GET ALL / FILTER
# ============================================================

@app.get(
    "/mcqs",
    response_model=
        List[
            schemas.MCQResponse
        ]
)
def get_mcqs(

    course_id:
        int | None = None,

    skip: int = 0,

    limit: int = 20,

    db: Session =
        Depends(get_db)

):

    query = db.query(
        models.MCQ
    )


    if course_id is not None:

        query = query.filter(

            models.MCQ.course_id ==
            course_id
        )


    mcqs = (

        query

        .offset(skip)

        .limit(limit)

        .all()
    )


    return [

        mcq_to_response(
            mcq
        )

        for mcq
        in mcqs
    ]


# ============================================================
# MCQ - COUNT
#
# KEEP BEFORE /mcqs/{mcq_id}
# ============================================================

@app.get(
    "/mcqs/count/{course_id}"
)
def count_mcqs(

    course_id: int,

    db: Session =
        Depends(get_db)

):

    count = (

        db.query(
            models.MCQ
        )

        .filter(
            models.MCQ.course_id ==
            course_id
        )

        .count()
    )


    return {

        "course_id":
            course_id,

        "total_mcqs":
            count
    }


# ============================================================
# MCQ - BULK DELETE
#
# KEEP BEFORE /mcqs/{mcq_id}
# ============================================================

@app.delete(
    "/mcqs/bulk"
)
def delete_mcqs_bulk(

    data:
        schemas.BulkDeleteRequest,

    db: Session =
        Depends(get_db)

):

    mcqs = (

        db.query(
            models.MCQ
        )

        .filter(
            models.MCQ.id.in_(
                data.ids
            )
        )

        .all()
    )


    if not mcqs:

        raise HTTPException(
            status_code=404,
            detail=
                "No MCQs found"
        )


    deleted_ids = [

        mcq.id

        for mcq
        in mcqs
    ]


    for mcq in mcqs:

        db.delete(
            mcq
        )


    db.commit()


    return {

        "message":
            "MCQs deleted successfully",

        "requested_count":
            len(data.ids),

        "deleted_count":
            len(deleted_ids),

        "deleted_ids":
            deleted_ids
    }


# ============================================================
# MCQ - GET ONE
# ============================================================

@app.get(
    "/mcqs/{mcq_id}",
    response_model=
        schemas.MCQResponse
)
def get_mcq(

    mcq_id: int,

    db: Session =
        Depends(get_db)

):

    mcq = (

        db.query(
            models.MCQ
        )

        .filter(
            models.MCQ.id ==
            mcq_id
        )

        .first()
    )


    if mcq is None:

        raise HTTPException(
            status_code=404,
            detail=
                "MCQ not found"
        )


    return mcq_to_response(
        mcq
    )


# ============================================================
# MCQ - UPDATE
# ============================================================

@app.put(
    "/mcqs/{mcq_id}",
    response_model=
        schemas.MCQResponse
)
def update_mcq(

    mcq_id: int,

    mcq_data:
        schemas.MCQUpdate,

    db: Session =
        Depends(get_db)

):

    mcq = (

        db.query(
            models.MCQ
        )

        .filter(
            models.MCQ.id ==
            mcq_id
        )

        .first()
    )


    if mcq is None:

        raise HTTPException(
            status_code=404,
            detail=
                "MCQ not found"
        )


    course = (

        db.query(
            models.Course
        )

        .filter(
            models.Course.id ==
            mcq_data.course_id
        )

        .first()
    )


    if course is None:

        raise HTTPException(
            status_code=404,
            detail=
                "Course not found"
        )


    if (
        mcq_data.answer
        not in
        mcq_data.options
    ):

        raise HTTPException(
            status_code=400,
            detail=
                "Answer must exist in options"
        )


    mcq.course_id = (
        mcq_data.course_id
    )

    mcq.question = (
        mcq_data.question
    )

    mcq.answer = (
        mcq_data.answer
    )


    mcq.options.clear()


    for option in mcq_data.options:

        mcq.options.append(

            models.MCQOption(
                option_text=
                    option
            )
        )


    db.commit()

    db.refresh(mcq)


    return mcq_to_response(
        mcq
    )


# ============================================================
# MCQ - DELETE ONE
# ============================================================

@app.delete(
    "/mcqs/{mcq_id}"
)
def delete_mcq(

    mcq_id: int,

    db: Session =
        Depends(get_db)

):

    mcq = (

        db.query(
            models.MCQ
        )

        .filter(
            models.MCQ.id ==
            mcq_id
        )

        .first()
    )


    if mcq is None:

        raise HTTPException(
            status_code=404,
            detail=
                "MCQ not found"
        )


    db.delete(
        mcq
    )

    db.commit()


    return {
        "message":
            "MCQ deleted successfully"
    }