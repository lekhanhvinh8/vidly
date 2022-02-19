import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../../services/authService";

const ProtectedRoute = ({ path, ...rest }) => {
  const user = auth.getCurrentUser();

  if (user) return <Route path={path} {...rest} />;
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        console.log("productedRoute", props);
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
