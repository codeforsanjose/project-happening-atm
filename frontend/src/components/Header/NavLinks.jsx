import React from 'react';

function NavLinks({ toggled }) {
  return (
    <ul className={toggled ? 'nav-links nav-links-active' : 'nav-links'}>
      <li>
        <a href='#' rel='noopener noreferrer'>
          Add Meeting to Calendar
        </a>
      </li>
      <li>
        <a href='#' rel='noopener noreferrer'>
          Participate in the VIrtual Meeting
        </a>
      </li>
      <li>
        <a href='#' rel='noopener noreferrer'>
          Watch Meeting Broadcast
        </a>
      </li>
      <li>
        <a href='#' rel='noopener noreferrer'>
          Submit Written Public Comment
        </a>
      </li>
      <li>
        <a href='#' rel='noopener noreferrer'>
          Request Separate Consideration of a Consent Calendar Item
        </a>
      </li>
    </ul>
  );
}

export default NavLinks;
