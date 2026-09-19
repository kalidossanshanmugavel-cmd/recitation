from sqlalchemy import ForeignKey, String

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from database import Base


# ============================================================
# USER
# ============================================================

class User(Base):

    __tablename__ = "users"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )


    name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )


    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True,
        nullable=False
    )


    password_hash: Mapped[str] = mapped_column(
        String,
        nullable=False
    )


# ============================================================
# COURSE
# ============================================================

class Course(Base):

    __tablename__ = "courses"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )


    title: Mapped[str] = mapped_column(
        String,
        nullable=False,
        index=True
    )


    description: Mapped[str] = mapped_column(
        String,
        nullable=False
    )


    progress: Mapped[int] = mapped_column(
        default=0
    )


    lessons: Mapped[int] = mapped_column(
        default=0
    )


    mcqs: Mapped[list["MCQ"]] = relationship(
        back_populates="course",
        cascade="all, delete-orphan"
    )


# ============================================================
# MCQ
# ============================================================

class MCQ(Base):

    __tablename__ = "mcqs"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )


    course_id: Mapped[int] = mapped_column(
        ForeignKey("courses.id"),
        nullable=False,
        index=True
    )


    question: Mapped[str] = mapped_column(
        String,
        nullable=False
    )


    answer: Mapped[str] = mapped_column(
        String,
        nullable=False
    )


    course: Mapped["Course"] = relationship(
        back_populates="mcqs"
    )


    options: Mapped[list["MCQOption"]] = relationship(
        back_populates="mcq",
        cascade="all, delete-orphan"
    )


# ============================================================
# MCQ OPTION
# ============================================================

class MCQOption(Base):

    __tablename__ = "mcq_options"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )


    mcq_id: Mapped[int] = mapped_column(
        ForeignKey("mcqs.id"),
        nullable=False,
        index=True
    )


    option_text: Mapped[str] = mapped_column(
        String,
        nullable=False
    )


    mcq: Mapped["MCQ"] = relationship(
        back_populates="options"
    )