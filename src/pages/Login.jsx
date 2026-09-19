import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import "./Login.css";


function Login() {

  const navigate = useNavigate();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);


    try {

      await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );


      navigate("/");

    } catch (error) {

      setError(
        error.response?.data?.detail
        || "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>Recitation</h1>

        <h2>Login</h2>

        <p>
          Login to continue learning.
        </p>


        <form onSubmit={handleSubmit}>


          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
            />

          </div>


          {error && (

            <div className="auth-error">
              {error}
            </div>

          )}


          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >

            {
              loading
                ? "Logging in..."
                : "Login"
            }

          </button>


        </form>


        <p className="auth-link">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}


export default Login;