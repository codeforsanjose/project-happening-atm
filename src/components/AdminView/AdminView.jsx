import React from 'react';
import './AdminView.scss';
import { Table } from 'rsuite';
import AdminNavigation from './AdminNavigation'
// import 'rsuite/lib/styles/index.less'; 
import 'rsuite/dist/styles/rsuite-default.css';
const { Column, HeaderCell, Cell, Pagination } = Table;
/**
 * import fakeData from
 * https://github.com/rsuite/rsuite.github.io/blob/master/src/components/table/data/users.js
 */

class FixedColumnTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {'email': 'fakedata@fakedata.com'}
      ]
    };
  }
  render() {
    return (
      <div>
        <Table
          height={400}
          data={this.state.data}
          onRowClick={data => {
            console.log(data);
          }}
        >
          <Column width={300}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>
        </Table>
      </div>
    );
  }
}
function AdminView() {

    return (
        <div className="admin-view">
          <AdminNavigation />

          <div className="wrapper">
            I am the Admin View
            <FixedColumnTable />
          </div>
        </div>
    );
}

export default AdminView;
