function QuizSetup({
  courses,
  studentName,
  setStudentName,
  selectedCourse,
  setSelectedCourse,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount,
  shuffle,
  setShuffle,
  onStart
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onStart();
  };

  return (
    <div className="quiz-setup">

      <h1>MCQ Practice</h1>

      <p>
        Configure your practice session.
      </p>

      <form onSubmit={handleSubmit}>

        {/* STUDENT NAME */}

        <div className="form-group">

          <label htmlFor="studentName">
            Student Name
          </label>

          <input
            id="studentName"
            name="studentName"
            type="text"
            placeholder="Enter student name"
            value={studentName}
            onChange={(event) =>
              setStudentName(event.target.value)
            }
            required
          />

        </div>


        {/* COURSE */}

        <div className="form-group">

          <label htmlFor="course">
            Course
          </label>

          <select
            id="course"
            name="course"
            value={selectedCourse}
            onChange={(event) =>
              setSelectedCourse(event.target.value)
            }
            required
          >

            <option value="">
              Select Course
            </option>

            {courses.map((course) => (

              <option
                key={course.id}
                value={course.id}
              >
                {course.title}
              </option>

            ))}

          </select>

        </div>


        {/* DIFFICULTY */}

        <fieldset className="form-group">

          <legend>
            Difficulty
          </legend>

          <label>
            <input
              type="radio"
              name="difficulty"
              value="all"
              checked={difficulty === "all"}
              onChange={(event) =>
                setDifficulty(event.target.value)
              }
            />
            All
          </label>

          <label>
            <input
              type="radio"
              name="difficulty"
              value="easy"
              checked={difficulty === "easy"}
              onChange={(event) =>
                setDifficulty(event.target.value)
              }
            />
            Easy
          </label>

          <label>
            <input
              type="radio"
              name="difficulty"
              value="medium"
              checked={difficulty === "medium"}
              onChange={(event) =>
                setDifficulty(event.target.value)
              }
            />
            Medium
          </label>

          <label>
            <input
              type="radio"
              name="difficulty"
              value="hard"
              checked={difficulty === "hard"}
              onChange={(event) =>
                setDifficulty(event.target.value)
              }
            />
            Hard
          </label>

        </fieldset>


        {/* QUESTION COUNT */}

        <div className="form-group">

          <label htmlFor="questionCount">
            Number of Questions
          </label>

          <select
            id="questionCount"
            name="questionCount"
            value={questionCount}
            onChange={(event) =>
              setQuestionCount(
                Number(event.target.value)
              )
            }
          >

            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={50}>
              50
            </option>

          </select>

        </div>


        {/* SHUFFLE */}

        <div className="form-group checkbox-group">

          <label>

            <input
              type="checkbox"
              name="shuffle"
              checked={shuffle}
              onChange={(event) =>
                setShuffle(event.target.checked)
              }
            />

            Shuffle Questions

          </label>

        </div>


        {/* START */}

        <button
          type="submit"
          className="start-button"
        >
          Start Quiz
        </button>

      </form>

    </div>
  );
}

export default QuizSetup;