import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Learning</h3>

      <nav>
        <NavLink to="/" className="sidebar-item">
          Dashboard
        </NavLink>

        <NavLink to="/courses" className="sidebar-item">
          Courses
        </NavLink>

        <NavLink to="/mcq" className="sidebar-item">
          MCQ
        </NavLink>

        <NavLink to="/practice" className="sidebar-item">
          Practice
        </NavLink>

        <NavLink to="/assessment" className="sidebar-item">
          Assessment
        </NavLink>

        <NavLink to="/progress" className="sidebar-item">
          Progress
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;