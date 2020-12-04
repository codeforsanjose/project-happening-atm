import React, { Component, useEffect } from 'react'
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from 'react-sortable-hoc'
import { defaultTableRowRenderer, Table, Column } from 'react-virtualized'
import 'react-virtualized/styles.css'
import './AgendaTable.scss'
import CustomDropdown from '../CustomDropdown/CustomDropdown.jsx'
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox.jsx'

const SortableTable = SortableContainer(Table)
const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer)

function rowRenderer(props) {
  return <SortableTableRowRenderer {...props} />
}
function CustomizedTable(props) {
  /*One of the features of this library is the ability to window the table and scroll within it.
  For now this feature has to be foregone so I can set an overflow CSS propertu to make the dropdown box work.
  And so, I set the height of this to fit all the rows.
  
  Also, I think this component's height is being calculated and rendered after the height of the whole page is calculated.
  Longer tables caused the background color to not cover the entire page, so I think I need to pass this height up the 
  component tree so it can be recalculated once this child component mounts.*/
  const rowHeight = 50
  const height = props.items.length * rowHeight
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
      rowCount={props.items.length}
      remainingOptions={props.remainingOptions}
      {...props}
    >
      <Column
        style={{ 'text-align': 'center' }}
        label="Select"
        dataKey="checkbox"
        width={60}
        cellRenderer={({ cellData }) => {
          return <CustomCheckbox checked={cellData} />
        }}
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
  )
}

class SortableCustomizedTable extends Component {
  state = {
    items: [
      {
        checkbox: false,
        agendaItem: 'Pledge of Allegiance',
        agendaStatus: 'in progress',
        height: 89,
      },
      {
        checkbox: true,
        agendaItem: 'Invocation',
        agendaStatus: 'deferred',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem: 'Orders of the Day',
        agendaStatus: 'closed',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem: 'Closed Session Report',
        agendaStatus: 'completed',
        height: 89,
      },
      {
        checkbox: true,
        agendaItem: '1 Ceremonial Items',
        agendaStatus: 'completed',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem: '2 Consent Calendar',
        agendaStatus: 'deferred',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem:
          '3.1 Report of the City Manager, David Sykes (Verbal Report)',
        agendaStatus: 'deferred',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem: '3.2 Labor Negotiations Update',
        agendaStatus: 'deferred',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem: '3.3 San Jose Food Distribution Update',
        agendaStatus: 'deferred',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem:
          '3.4 Coronavirus Relief Funds for Resident Assistance Efforts',
        agendaStatus: 'deferred',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem: '4.1 San Jose Food Distribution Update',
        agendaStatus: 'deferred',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem: '4.2 Lorem ipsum',
        agendaStatus: 'deferred',
        height: 89,
      },
      {
        checkbox: false,
        agendaItem: '4.3 Other',
        agendaStatus: 'deferred',
        height: 89,
      },
    ],
  }
  // remainingOptions takes the current status, cellData, and returns an array of strings of the options other than currentStatus
  remainingOptions = cellData => {
    //compare with a hard coded array of all the options and return a new array
    let remainingOptions = []
    const allOptions = [
      'in progress',
      'deferred',
      'closed',
      'completed',
      'pending',
    ]
    allOptions.forEach(option => {
      if (option !== cellData) {
        remainingOptions.push(option)
      } else {
        return null
      }
    })
    return remainingOptions
  }

  registerTableRef = tableInstance => {
    this.Table = tableInstance
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return
    const { items } = this.state
    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
    })
  }

  render(props) {
    const { items } = this.state
    return (
      <CustomizedTable
        items={items}
        getRef={this.registerTableRef}
        onSortEnd={this.onSortEnd}
        remainingOptions={this.remainingOptions}
        // recalculatePageHeight={this.props.recalculatePageHeight}
      />
    )
  }
}

export default SortableCustomizedTable
