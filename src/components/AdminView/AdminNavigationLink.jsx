import React from 'react';
import './AdminNavigationLink.scss';

function AdminNavigationLink({ icon, linkText }) {


  return (
    <li className="admin-nav-link">

      <button>
        <div className="button-group">
          <div className="button-group-inner">
            <img className="button-icon" src={icon} />
            <span className="button-text">{linkText}</span>
          </div>
        </div>
      </button>
    </li>
  );
}

export default AdminNavigationLink;