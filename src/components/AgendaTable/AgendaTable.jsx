import React, {Component} from 'react';
import {arrayMove, SortableContainer, SortableElement} from 'react-sortable-hoc';
import {defaultTableRowRenderer, Table, Column} from 'react-virtualized';
import 'react-virtualized/styles.css';
import './AgendaTable.scss';
const SortableTable = SortableContainer(Table);
const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer);

function rowRenderer(props) {
  return <SortableTableRowRenderer {...props} />;
}
// change is about to come
function CustomizedTable(props) {
  return (
    <SortableTable 
      rowRenderer={rowRenderer} 
      rowGetter={({index}) => props.items[index]}
      width={800}
      height={600}
      headerHeight={20}
      rowHeight={30}
      rowCount={props.items.length}
      {...props} 
    >
      <Column 
        label="Select" 
        dataKey="checkbox" 
        width={25} 
        headerRenderer={() => {
          // something
          return <input type="checkbox"/>
        }}
        cellRenderer={({cellData}) => {
          return (
            <input 
              type="checkbox" 
              checked={cellData}
            />
          )
        }}
      />
      <Column 
        label="Agenda Item" 
        dataKey="agendaItem" 
        width={500} 
      />
      <Column
        label="Status"
        dataKey="agendaStatus"
        width={100}
        cellRenderer={({cellData}) => {
          return(
            <select value={cellData}>
              <option value="in-progress">In Progress</option>
              <option value="deferred">Deferred</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          )
        }}
      />
    </SortableTable>
  );
}

class SortableCustomizedTable extends Component {
  state = {
    items: [
      {checkbox: false, agendaItem: 'Pledge of Allegiance', agendaStatus: 'in-progress', height: 89},
      {checkbox: true, agendaItem: 'Invocation', agendaStatus: 'deferred', height: 89},
      {checkbox: false, agendaItem: 'Orders of the Day', agendaStatus: 'closed', height: 89},
      {checkbox: false, agendaItem: 'Closed Session Report', agendaStatus: 'completed', height: 89},
      {checkbox: true, agendaItem: '1 Ceremonial Items', agendaStatus: 'completed', height: 89},
      {checkbox: false, agendaItem: '2 Consent Calendar', agendaStatus: 'deferred', height: 89},
      {checkbox: false, agendaItem: '3.1 Report of the City Manager, David Sykes (Verbal Report)', agendaStatus: 'deferred', height: 89},
      {checkbox: false, agendaItem: '3.2 Labor Negotiations Update', agendaStatus: 'deferred', height: 89},
      {checkbox: false, agendaItem: '3.3 San Jose Food Distribution Update', agendaStatus: 'deferred', height: 89},
      {checkbox: false, agendaItem: '3.4 Coronavirus Relief Funds for Resident Assistance Efforts', agendaStatus: 'deferred', height: 89},
      {checkbox: false, agendaItem: '4.1 San Jose Food Distribution Update', agendaStatus: 'deferred', height: 89},
      {checkbox: false, agendaItem: '4.2 Lorem ipsum', agendaStatus: 'deferred', height: 89},
      {checkbox: false, agendaItem: '4.3 Other', agendaStatus: 'deferred', height: 89},
    ]
  }

  registerTableRef = tableInstance => {
    this.Table = tableInstance;
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) return;
    const {items} = this.state;
    this.setState({
      items: arrayMove(items, oldIndex, newIndex)
    });
    // this.Table.recomputeRowHeight();
    // this.Table.forceUpdate();
  }

  render() {
    const {items} = this.state;
    return(
      <CustomizedTable
        items={items}
        getRef={this.registerTableRef}
        onSortEnd={this.onSortEnd}
      />
    );
  }
}

export default SortableCustomizedTable;