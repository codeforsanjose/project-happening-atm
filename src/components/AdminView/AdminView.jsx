import React from 'react';
import './AdminView.scss';

import AdminNavigation from './AdminNavigation'

function AdminView() {

    return (
        <div className="admin-view">
          <AdminNavigation />

          <div className="wrapper">
            I am the Admin View
          </div>
        </div>
    );
}

export default AdminView;