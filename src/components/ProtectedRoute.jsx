import {
  useEffect,
  useState
} from "react";

import {
  Navigate
} from "react-router-dom";

import api from "../services/api";


function ProtectedRoute({ children }) {

  const [authenticated, setAuthenticated] =
    useState(null);


  useEffect(() => {

    checkAuthentication();

  }, []);


  const checkAuthentication = async () => {

    try {

      await api.get("/auth/me");

      setAuthenticated(true);

    } catch (error) {

      setAuthenticated(false);

    }

  };


  if (authenticated === null) {

    return (
      <p>
        Checking authentication...
      </p>
    );

  }


  if (!authenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return children;

}


export default ProtectedRoute;