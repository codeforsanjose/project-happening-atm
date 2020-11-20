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
          <button className='nav-title' onClick={handleTitleClick}>
            My City's Agenda
          </button>
          <HamburgerIcon onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} />
      </nav>
    </header>
  );
}

export default Header;
