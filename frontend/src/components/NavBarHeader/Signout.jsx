import React from "react";
import LoginContext from '../LoginContext/LoginContext';
import LocalStorageTerms from '../../constants/LocalStorageTerms';
import "./Signout.scss";

function Signout({t}) {
    
    const loginContext = React.useContext(LoginContext);
    
    const signOut = () => {
        window.localStorage.removeItem(LocalStorageTerms.TOKEN);
        window.localStorage.setItem(LocalStorageTerms.SIGNED_IN, false);
        loginContext.setSignedIn(false);
    };

    return (
        <button className="sign-out" type="button" onClick={signOut}>{t('navbar.sign-out')}</button>
    );
    
}

export default Signout;