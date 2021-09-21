import { createContext } from 'react';

// This component is used to allow the passing of the signedIn and setSignedIn props
// to the NavBarHeader component accross the application
const LoginContext = createContext();
export default LoginContext;
