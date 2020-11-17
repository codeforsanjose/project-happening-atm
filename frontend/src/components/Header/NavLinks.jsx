import React from 'react';

function NavLinks({ toggled }) {
  return (
    <ul className={toggled ? 'nav-links nav-links-active' : 'nav-links'}>
      <li>Add Meeting to Calendar</li>
      <li>Participate in the VIrtual Meeting</li>
      <li>Watch Meeting Broadcast</li>
      <li>Submit Written Public Comment</li>
      <li>Request Separate Consideration of a Consent Calendar Item</li>
    </ul>
  );
}

export default NavLinks;
