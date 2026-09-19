import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import MCQ from "./pages/MCQ";
import Practice from "./pages/Practice";
import Assessment from "./pages/Assessment";
import Progress from "./pages/Progress";


import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";


import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ============================================= */}
        {/* PUBLIC ROUTES */}
        {/* ============================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        {/* ============================================= */}
        {/* PROTECTED APPLICATION */}
        {/* ============================================= */}

        <Route
          element={

            <ProtectedRoute>

              <AppLayout />

            </ProtectedRoute>

          }
        >


          <Route
            path="/"
            element={<Dashboard />}
          />


          <Route
            path="/courses"
            element={<Courses />}
          />


          <Route
            path="/courses/:courseId"
            element={<CourseDetails />}
          />


          <Route
            path="/mcq"
            element={<MCQ />}
          />


          <Route
            path="/practice"
            element={<Practice />}
          />


          <Route
            path="/assessment"
            element={<Assessment />}
          />


          <Route
            path="/progress"
            element={<Progress />}
          />


        </Route>


      </Routes>

    </BrowserRouter>
  );
}


export default App;