import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

function AuthRoute({
  children, path, exact, signedIn,
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
