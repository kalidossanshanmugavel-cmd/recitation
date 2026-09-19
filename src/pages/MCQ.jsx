import {
  useEffect,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import api from "../services/api";

import Option from "../components/Option";

import "./MCQ.css";


function MCQ() {

  const [searchParams] =
    useSearchParams();


  const courseFromUrl =
    searchParams.get("courseId");


  // =========================================================
  // SETUP STATE
  // =========================================================

  const [courses, setCourses] =
    useState([]);


  const [courseId, setCourseId] =
    useState(
      courseFromUrl || ""
    );


  const [questionCount, setQuestionCount] =
    useState(5);


  const [shuffle, setShuffle] =
    useState(false);


  // =========================================================
  // QUIZ STATE
  // =========================================================

  const [questions, setQuestions] =
    useState([]);


  const [currentIndex, setCurrentIndex] =
    useState(0);


  const [answers, setAnswers] =
    useState({});


  const [reviewQuestions, setReviewQuestions] =
    useState([]);


  const [quizStarted, setQuizStarted] =
    useState(false);


  const [quizFinished, setQuizFinished] =
    useState(false);


  // =========================================================
  // UI STATE
  // =========================================================

  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD COURSES
  // =========================================================

  useEffect(() => {

    loadCourses();

  }, []);


  const loadCourses = async () => {

    try {

      const response =
        await api.get(
          "/courses?skip=0&limit=100"
        );


      setCourses(
        response.data
      );


    } catch (error) {

      console.error(error);

      setError(
        "Unable to load courses"
      );

    }

  };


  // =========================================================
  // SHUFFLE FUNCTION
  // =========================================================

  const shuffleQuestions = (
    questionList
  ) => {

    const copiedQuestions = [
      ...questionList
    ];


    for (
      let i =
        copiedQuestions.length - 1;

      i > 0;

      i--
    ) {

      const randomIndex =
        Math.floor(
          Math.random() *
          (i + 1)
        );


      [
        copiedQuestions[i],
        copiedQuestions[randomIndex]
      ] = [
        copiedQuestions[randomIndex],
        copiedQuestions[i]
      ];

    }


    return copiedQuestions;

  };


  // =========================================================
  // START QUIZ
  // =========================================================

  const startQuiz = async () => {

    if (!courseId) {

      setError(
        "Please select a course"
      );

      return;

    }


    try {

      setLoading(true);

      setError("");


      const response =
        await api.get(
          `/mcqs?course_id=${courseId}&skip=0&limit=${questionCount}`
        );


      let loadedQuestions =
        response.data;


      if (
        loadedQuestions.length === 0
      ) {

        setError(
          "No questions available for this course"
        );

        return;

      }


      if (shuffle) {

        loadedQuestions =
          shuffleQuestions(
            loadedQuestions
          );

      }


      setQuestions(
        loadedQuestions
      );


      setCurrentIndex(0);

      setAnswers({});

      setReviewQuestions([]);

      setQuizFinished(false);

      setQuizStarted(true);


    } catch (error) {

      console.error(error);

      setError(
        "Unable to load questions"
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // SELECT ANSWER
  // =========================================================

  const selectAnswer = (
    option
  ) => {

    const currentQuestion =
      questions[currentIndex];


    setAnswers(
      previousAnswers => ({

        ...previousAnswers,

        [currentQuestion.id]:
          option

      })
    );

  };


  // =========================================================
  // MARK FOR REVIEW
  // =========================================================

  const toggleReview = () => {

    const questionId =
      questions[currentIndex].id;


    setReviewQuestions(
      previous => {

        if (
          previous.includes(
            questionId
          )
        ) {

          return previous.filter(
            id =>
              id !== questionId
          );

        }


        return [
          ...previous,
          questionId
        ];

      }
    );

  };


  // =========================================================
  // PREVIOUS
  // =========================================================

  const previousQuestion = () => {

    if (currentIndex > 0) {

      setCurrentIndex(
        currentIndex - 1
      );

    }

  };


  // =========================================================
  // NEXT
  // =========================================================

  const nextQuestion = () => {

    if (
      currentIndex <
      questions.length - 1
    ) {

      setCurrentIndex(
        currentIndex + 1
      );

    }

  };


  // =========================================================
  // FINISH QUIZ
  // =========================================================

  const finishQuiz = () => {

    setQuizFinished(true);

  };


  // =========================================================
  // RESTART
  // =========================================================

  const restartQuiz = () => {

    setQuizStarted(false);

    setQuizFinished(false);

    setQuestions([]);

    setAnswers({});

    setReviewQuestions([]);

    setCurrentIndex(0);

    setError("");

  };


  // =========================================================
  // CALCULATE SCORE
  // =========================================================

  const calculateScore = () => {

    let score = 0;


    questions.forEach(
      question => {

        if (
          answers[question.id] ===
          question.answer
        ) {

          score++;

        }

      }
    );


    return score;

  };


  // =========================================================
  // SETUP SCREEN
  // =========================================================

  if (!quizStarted) {

    return (

      <div className="mcq-page">

        <div className="mcq-header">

          <h1>
            MCQ Practice
          </h1>

          <p>
            Configure your practice session.
          </p>

        </div>


        <div className="quiz-setup">


          {/* COURSE */}

          <div className="form-group">

            <label htmlFor="course">

              Course

            </label>


            <select
              id="course"
              name="course"
              value={courseId}
              onChange={
                event =>
                  setCourseId(
                    event.target.value
                  )
              }
            >

              <option value="">

                Select Course

              </option>


              {courses.map(
                course => (

                  <option
                    key={course.id}
                    value={course.id}
                  >

                    {course.title}

                  </option>

                )
              )}

            </select>

          </div>


          {/* QUESTION COUNT */}

          <div className="form-group">

            <label
              htmlFor="questionCount"
            >

              Question Count

            </label>


            <select
              id="questionCount"
              name="questionCount"
              value={questionCount}
              onChange={
                event =>
                  setQuestionCount(
                    Number(
                      event.target.value
                    )
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

            </select>

          </div>


          {/* SHUFFLE */}

          <div className="checkbox-group">

            <input
              id="shuffle"
              name="shuffle"
              type="checkbox"
              checked={shuffle}
              onChange={
                event =>
                  setShuffle(
                    event.target.checked
                  )
              }
            />


            <label htmlFor="shuffle">

              Shuffle Questions

            </label>

          </div>


          {error && (

            <p className="error-message">

              {error}

            </p>

          )}


          <button
            type="button"
            className="start-button"
            onClick={startQuiz}
            disabled={loading}
          >

            {
              loading
                ? "Loading..."
                : "Start Quiz"
            }

          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // RESULT SCREEN
  // =========================================================

  if (quizFinished) {

    const score =
      calculateScore();


    return (

      <div className="mcq-page">

        <div className="result-card">

          <h1>
            Quiz Completed
          </h1>


          <h2>

            Score: {score} / {questions.length}

          </h2>


          <p>

            Answered: {
              Object.keys(
                answers
              ).length
            }

          </p>


          <p>

            Marked for Review: {
              reviewQuestions.length
            }

          </p>


          <button
            type="button"
            onClick={restartQuiz}
          >

            Practice Again

          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // QUESTION SCREEN
  // =========================================================

  const currentQuestion =
    questions[currentIndex];


  const selectedAnswer =
    answers[currentQuestion.id];


  const markedForReview =
    reviewQuestions.includes(
      currentQuestion.id
    );


  return (

    <div className="mcq-page">

      <div className="mcq-header">

        <h1>
          MCQ Practice
        </h1>


        <p>

          Question {
            currentIndex + 1
          } of {
            questions.length
          }

        </p>

      </div>


      <div className="question-card">

        <h2>

          {currentQuestion.question}

        </h2>


        <div className="options-list">

          {
            currentQuestion.options.map(
              option => (

                <Option

                  key={option}

                  option={option}

                  selected={
                    selectedAnswer ===
                    option
                  }

                  onSelect={
                    selectAnswer
                  }

                  disabled={false}

                />

              )
            )
          }

        </div>


        <div className="review-section">

          <label>

            <input
              type="checkbox"
              checked={
                markedForReview
              }
              onChange={
                toggleReview
              }
            />

            Mark for Review

          </label>

        </div>


        <div className="quiz-actions">

          <button
            type="button"
            onClick={
              previousQuestion
            }
            disabled={
              currentIndex === 0
            }
          >

            Previous

          </button>


          {
            currentIndex <
            questions.length - 1
              ? (

                <button
                  type="button"
                  onClick={
                    nextQuestion
                  }
                >

                  Next

                </button>

              )
              : (

                <button
                  type="button"
                  onClick={
                    finishQuiz
                  }
                >

                  Finish Quiz

                </button>

              )
          }

        </div>

      </div>

    </div>

  );

}


export default MCQ;