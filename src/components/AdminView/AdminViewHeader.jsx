import React from 'react';
import './AdminViewHeader.scss';

function AdminViewHeader({ text }) {
    return (
        <div className="admin-view-header">
          <h1>{text}</h1>
        </div>
    );
}

export default AdminViewHeader;
