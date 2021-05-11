import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

function AuthRoute({ children, link }) {
  console.log('AuthRoute');
  return (
    <Route
      path={link}
      render={({ location }) => (true ? (
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
