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
          <button onClick={handleTitleClick} className='nav-title'>
            My City's Agenda
          </button>
          <HamburgerIcon onClick={handleToggle} toggled={toggled} />
        </div>
        <NavLinks toggled={toggled} />
      </nav>
      <div
        className={`nav-bg ${toggled ? '' : 'nav-bg-deactive'}`}
        onClick={handleToggle}
      ></div>
    </header>
  );
}

export default Header;
