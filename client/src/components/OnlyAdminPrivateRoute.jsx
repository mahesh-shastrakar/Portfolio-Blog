// the OnlyAdminPrivateRoute component is a custom route component that only allows admin users to access the route. If the user is not an admin user, they will be redirected to the sign in page. The component uses the useSelector hook to access the current user from the Redux store and checks if the user is an admin user. If the user is an admin user, the child components of the route are rendered using the Outlet component. If the user is not an admin user, the user is redirected to the sign in page using the Navigate component.
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
const OnlyAdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Only allow the user to access the route if they are an admin user
  return currentUser && currentUser.isAdmin ? (
    // Render the child components of the route using the Outlet component
    <Outlet />
  ) : (
    // Redirect the user to the sign in page if they are not an admin user
    <Navigate to="/signin" />
  );
};

export default OnlyAdminPrivateRoute;
