import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, token }) => {
//   return token ? Component : <Navigate to="/" />;
  return token ? Component : Component;
};

export default PrivateRoute;