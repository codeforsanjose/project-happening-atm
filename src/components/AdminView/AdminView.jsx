import React from 'react';
import './AdminView.scss';

import AdminNavigation from './AdminNavigation'
import AdminUploadView from './AdminViewPages/AdminUploadView';

function AdminView() {

    return (
        <div className="admin-view">
          <AdminNavigation />

          <div className="wrapper">

            <AdminUploadView />
          </div>
        </div>
    );
}

export default AdminView;
