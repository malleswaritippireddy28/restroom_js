import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../utilities/utility";

const ProtectedRoute = ({ children, role }) => {
  const user = getToken();
  let location = useLocation();

  console.log(role);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user && role) {
    if (user.isAdmin) return children;
    else return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
