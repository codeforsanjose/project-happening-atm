import React from 'react'
import './Header.scss'
import HamburgerMenuIcon from './HamburgerMenuIcon'
import classnames from 'classnames'
import Search from './Search'

function Header({ toggleMenu, shouldHide }) {
  return (
    <div
      className={classnames('header', {
        hide: shouldHide,
      })}
    >
      <div className={classnames('header-content')}>
        <div className="row">
          <HamburgerMenuIcon onClick={toggleMenu} />
        </div>
        <div className="meeting-info">
          <div className="title">San Jose City Council Agenda</div>

          <div className="date">August 18, 2020 at 11:00 AM</div>
        </div>
        <div className="row header-buttons">
          <button className="button admin-login-button">Login As Admin</button>
          <button className="button join-virtual-meeting-button">
            Join the Virtual Meeting
          </button>
        </div>

        <Search />
      </div>
    </div>
  )
}

export default Header
