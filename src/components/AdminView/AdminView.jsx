import React from 'react';
import './AdminView.scss';
import AdminNavigation from './AdminNavigation';
import AgendaTable from '../AgendaTable/AgendaTable';

function AdminView() {
    return (
        <div className="admin-view">
          <AdminNavigation />
          <div className="wrapper">
            <AgendaTable />
          </div>
        </div>
    );
}

export default AdminView;
