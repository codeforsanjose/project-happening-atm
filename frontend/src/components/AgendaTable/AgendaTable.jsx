import React, { Component } from 'react';
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from 'react-sortable-hoc';
import { defaultTableRowRenderer, Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';
import './AgendaTable.scss';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';

const SortableTable = SortableContainer(Table);
const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer);

function rowRenderer(props) {
  return <SortableTableRowRenderer {...props} />;
}
function CustomizedTable(props) {
  /* One of the features of this library is the ability
  to window the table and scroll within it.
  For now this feature has to be foregone so I can set an
  overflow CSS propertu to make the dropdown box work.
  And so, I set the height of this to fit all the rows.

  Also, I think this component's height is being calculated
  and rendered after the height of the whole page is calculated.
  Longer tables caused the background color to not cover the
  entire page, so I think I need to pass this height up the
  component tree so it can be recalculated once this child component mounts. */
  const { items, remainingOptions } = props;
  const rowHeight = 50;
  const height = items.length * rowHeight;
  // useEffect(() => props.recalculatePageHeight(height))
  return (
    <SortableTable
      distance={1}
      rowRenderer={rowRenderer}
      rowGetter={({ index }) => props.items[index]}
      width={735}
      height={height}
      headerHeight={20}
      rowHeight={rowHeight}
      rowCount={items.length}
      remainingOptions={remainingOptions}
      {...props}
    >
      <Column
        style={{ 'text-align': 'center' }}
        label="Select"
        dataKey="checkbox"
        width={60}
        cellRenderer={({ cellData }) => <CustomCheckbox checked={cellData} />}
      />
      <Column label="Agenda Item" dataKey="agendaItem" width={500} />
      {/* Please note you can't just add an onClick prop: https://github.com/clauderic/react-sortable-hoc#click-events-being-swallowed */}
      <Column
        style={{ 'text-align': 'center' }}
        label="Status"
        dataKey="agendaStatus"
        width={175}
        cellRenderer={({ cellData }) => (
          <CustomDropdown
            cellData={cellData}
            remainingOptions={props.remainingOptions(cellData)}
          />
        )}
      />
    </SortableTable>
  );
}

class SortableCustomizedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          id: 1,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: 'Pledge of Allegiance',
          agendaStatus: 'in progress',
          height: 89,
        },
        {
          id: 14,
          parent_meeting_item_id: 1,
          checkbox: false,
          agendaItem: 'I pledge allegiance to the Flag of the United States of America,',
          agendaStatus: 'completed',
          height: 89,
        },
        {
          id: 15,
          parent_meeting_item_id: 1,
          checkbox: false,
          agendaItem: 'and to the Republic for which it stands,',
          agendaStatus: 'completed',
          height: 89,
        },
        {
          id: 16,
          parent_meeting_item_id: 1,
          checkbox: false,
          agendaItem: 'one Nation under God,',
          agendaStatus: 'completed',
          height: 89,
        },
        {
          id: 17,
          parent_meeting_item_id: 1,
          checkbox: false,
          agendaItem: 'indivisible',
          agendaStatus: 'completed',
          height: 89,
        },
        {
          id: 18,
          parent_meeting_item_id: 1,
          checkbox: false,
          agendaItem: 'with liberty and justice for all. 🤪',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 2,
          parent_meeting_item_id: null,
          checkbox: true,
          agendaItem: 'Invocation',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 3,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: 'Orders of the Day',
          agendaStatus: 'closed',
          height: 89,
        },
        { 
          id: 4,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: 'Closed Session Report',
          agendaStatus: 'completed',
          height: 89,
        },
        {
          id: 5,
          parent_meeting_item_id: null,
          checkbox: true,
          agendaItem: '1 Ceremonial Items',
          agendaStatus: 'completed',
          height: 89,
        },
        {
          id: 6,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: '2 Consent Calendar',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 7,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem:
            '3.1 Report of the City Manager, David Sykes (Verbal Report)',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 8,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: '3.2 Labor Negotiations Update',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 9,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: '3.3 San Jose Food Distribution Update',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 10,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem:
            '3.4 Coronavirus Relief Funds for Resident Assistance Efforts',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 11,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: '4.1 San Jose Food Distribution Update',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 12,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: '4.2 Lorem ipsum',
          agendaStatus: 'deferred',
          height: 89,
        },
        {
          id: 13,
          parent_meeting_item_id: null,
          checkbox: false,
          agendaItem: '4.3 Other',
          agendaStatus: 'deferred',
          height: 89,
        },
      ],
    };
  }

  /* remainingOptions takes the current status, cellData, and returns
  an array of strings of the options other than currentStatus */
  remainingOptions = (cellData) => {
    // compare with a hard coded array of all the options and return a new array
    const remainingOptions = [];
    const allOptions = [
      'in progress',
      'deferred',
      'closed',
      'completed',
      'pending',
    ];
    allOptions.forEach((option) => {
      if (option !== cellData) {
        remainingOptions.push(option);
      } else {
        return null;
      }
    });
    return remainingOptions;
  }

  registerTableRef = (tableInstance) => {
    this.Table = tableInstance;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return;
    const { items } = this.state;
    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
    });
  }

  render(props) {
    const { items } = this.state;
    return (
      <CustomizedTable
        items={items}
        getRef={this.registerTableRef}
        onSortEnd={this.onSortEnd}
        remainingOptions={this.remainingOptions}
      // recalculatePageHeight={this.props.recalculatePageHeight}
      />
    );
  }
}

export default SortableCustomizedTable;
