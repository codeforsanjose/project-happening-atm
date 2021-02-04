import React from 'react';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './NavBarHeader.scss';

function Header({ toggled, handleToggle }) {
  return (
    <header>
      <nav className="no-select">
        <div className="nav-bar">

          {/* TODO: #121 Please fix these problems raise by ESLint. Thank you. */}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" rel="noopener noreferrer">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
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
