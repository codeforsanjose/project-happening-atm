import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

// This component redirects to the login page when the user is logged out
function AuthRoute({
  children, path, signedIn,
}) {
  return (
    <Route
      exact
      path={path}
      render={({ location }) => (signedIn ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location },
          }}
        />
      ))}
    />
  );
}

export default AuthRoute;
