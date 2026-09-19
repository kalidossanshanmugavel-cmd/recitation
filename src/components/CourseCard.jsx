import { Link } from "react-router-dom";


function CourseCard({ course }) {

  return (

    <div className="course-card">

      <div className="course-content">

        <h2>
          {course.title}
        </h2>

        <p>
          {course.description}
        </p>

        <p className="lesson-count">
          {course.lessons} lessons
        </p>


        <div className="course-progress">

          <div
            className="course-progress-bar"
            style={{
              width: `${course.progress}%`
            }}
          />

        </div>


        <div className="course-footer">

          <span>
            {course.progress}% completed
          </span>


          <Link
            to={`/courses/${course.id}`}
          >

            <button>

              {course.progress > 0
                ? "Continue"
                : "Start Learning"}

            </button>

          </Link>

        </div>

      </div>

    </div>

  );

}


export default CourseCard;