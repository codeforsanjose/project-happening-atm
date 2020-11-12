import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import HamburgerMenuIcon from './HamburgerMenuIcon'
import './NavigationMenu.scss'

function NavigationMenu({ toggleMenu, showMenu }) {
  return (
    <div
      className={classnames('navigation-menu', 'responsive-padding', {
        hide: !showMenu,
        show: showMenu,
      })}
    >
      <HamburgerMenuIcon onClick={toggleMenu} />
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </div>
  )
}

export default NavigationMenu
