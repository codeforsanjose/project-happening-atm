import React, { useState } from 'react';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';

function Header({toggled, handleToggle}) {
  return (
    <header>
      <nav className="no-select">
        <div className="nav-bar">
          <a href="#" rel="noopener noreferrer">
            My City's Agenda
          </a>
          <HamburgerIcon onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} className="nav-links" />
      </nav>
    </header>
  );
}

export default Header;
