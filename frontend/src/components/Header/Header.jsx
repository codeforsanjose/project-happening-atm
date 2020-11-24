import React, { useState } from 'react';
import HamburgerIcon from './HamburgerIcon';
import NavLinks from './NavLinks';
import './Header.scss';

function Header() {
  const [toggled, setToggled] = useState(false);

  function handleToggle() {
    setToggled(!toggled);
  }

  function handleTitleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setToggled(false);
  }

  return (
    <header>
      <nav className='no-select'>
        <div className='nav-bar'>
          <a href='#' rel='noopener noreferrer'>
            My City's Agenda
          </a>
          <HamburgerIcon onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} className='nav-links' />
      </nav>
    </header>
  );
}

export default Header;
