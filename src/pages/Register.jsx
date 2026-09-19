import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import "./Login.css";


function Register() {

  const navigate = useNavigate();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match"
      );

      return;
    }


    try {

      setLoading(true);


      await api.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      );


      navigate("/login");

    } catch (error) {

      setError(
        error.response?.data?.detail
        || "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>Recitation</h1>

        <h2>Create Account</h2>

        <p>
          Register to start learning.
        </p>


        <form onSubmit={handleSubmit}>


          <div className="form-group">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              required
            />

          </div>


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
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              minLength={8}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              minLength={8}
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
                ? "Creating account..."
                : "Register"
            }

          </button>


        </form>


        <p className="auth-link">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}


export default Register;