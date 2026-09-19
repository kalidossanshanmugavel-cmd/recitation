import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import "./Navbar.css";


function Navbar() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);


  useEffect(() => {

    loadCurrentUser();

  }, []);


  const loadCurrentUser = async () => {

    try {

      const response = await api.get(
        "/auth/me"
      );

      setUser(response.data);

    } catch (error) {

      console.error(
        "Unable to load user",
        error
      );

    }

  };


  const handleLogout = async () => {

    try {

      await api.post(
        "/auth/logout"
      );

    } catch (error) {

      console.error(
        "Logout error",
        error
      );

    } finally {

      navigate("/login");

    }

  };


  return (

    <nav className="navbar">

      <div className="navbar-brand">

        Recitation

      </div>


      <div className="navbar-user">

        {user && (

          <span className="user-name">

            Welcome, {user.name}

          </span>

        )}


        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >

          Logout

        </button>

      </div>

    </nav>

  );

}


export default Navbar;