import React from 'react';
import './AdminView.scss';

import AdminNavigation from './AdminNavigation/AdminNavigation'
import AdminHeader from './AdminHeader/AdminHeader';

function AdminView({ headerText, component: ComponentToRender }) {

    return (
        <div className="admin-view">
          <AdminNavigation />

          <div className="wrapper">
            <AdminHeader headerText={headerText} />
            <ComponentToRender />
          </div>
        </div>
    );
}

export default AdminView;
