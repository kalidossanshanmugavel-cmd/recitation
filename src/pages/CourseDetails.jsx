import { useEffect, useState } from "react";

import {
  useParams,
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";


function CourseDetails() {

  const { courseId } = useParams();

  const navigate = useNavigate();


  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    loadCourse();

  }, [courseId]);


  const loadCourse = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        `/courses/${courseId}`
      );

      setCourse(response.data);

      setError("");

    } catch (error) {

      console.error(error);

      setError(
        "Course not found"
      );

    } finally {

      setLoading(false);

    }

  };


  const startMCQ = () => {

    navigate(
      `/mcq?courseId=${courseId}`
    );

  };


  if (loading) {

    return (
      <p>
        Loading course...
      </p>
    );

  }


  if (error) {

    return (

      <div>

        <h1>
          Course Not Found
        </h1>

        <Link to="/courses">
          Back to Courses
        </Link>

      </div>

    );

  }


  return (

    <div className="course-details">

      <h1>
        {course.title}
      </h1>


      <p>
        {course.description}
      </p>


      <p>
        Progress: {course.progress}%
      </p>


      <p>
        Total Lessons: {course.lessons}
      </p>


      <hr />


      <h2>
        Course Content
      </h2>


      <p>
        Practice questions available for this course.
      </p>


      <button onClick={startMCQ}>

        Start MCQ

      </button>

    </div>

  );

}


export default CourseDetails;