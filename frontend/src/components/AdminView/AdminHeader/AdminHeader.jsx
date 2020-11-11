import React from 'react';
import './AdminHeader.scss';

export default function AdminHeader({ headerText }) {

  return (
    <div className="AdminHeader">
      <div className="top-nav">
        <button>Log Out</button>
      </div>

      <div className="header-text">
        {headerText}
      </div>
    </div>
  )
}