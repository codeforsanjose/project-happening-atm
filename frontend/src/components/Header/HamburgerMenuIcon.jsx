import React from 'react';
import "./HamburgerMenuIcon.scss";

function HamburgerMenuIcon({ onClick }) {
    return (
        <span className="hamburger-menu" style={{color: "white"}}>
            <i className="fas fa-bars fa-2x" onClick={onClick}/>
        </span>
    )
}

export default HamburgerMenuIcon;
