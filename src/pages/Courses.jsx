import { useEffect, useState } from "react";

import api from "../services/api";
import CourseCard from "../components/CourseCard";

import "./Courses.css";


function Courses() {

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    loadCourses();

  }, []);


  const loadCourses = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "/courses?skip=0&limit=100"
      );

      setCourses(response.data);

      setError("");

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load courses"
      );

    } finally {

      setLoading(false);

    }

  };


  if (loading) {

    return (
      <div className="courses-page">

        <h1>Courses</h1>

        <p>Loading courses...</p>

      </div>
    );

  }


  if (error) {

    return (
      <div className="courses-page">

        <h1>Courses</h1>

        <p>{error}</p>

      </div>
    );

  }


  return (

    <div className="courses-page">

      <div className="courses-header">

        <h1>Courses</h1>

        <p>
          Choose a course and continue learning.
        </p>

      </div>


      <div className="course-grid">

        {courses.map((course) => (

          <CourseCard
            key={course.id}
            course={course}
          />

        ))}

      </div>

    </div>

  );

}


export default Courses;