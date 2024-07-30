// the private route component is used to protect the routes that are only accessible to authenticated users. If the user is not authenticated, they will be redirected to the signin page. If the user is authenticated, they will be able to access the protected routes.
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  // Only allow the user to access the route if they are authenticated
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
