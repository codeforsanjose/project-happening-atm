import React, { useState } from 'react'
import classnames from 'classnames'
import ReactAutocomplete from 'react-autocomplete'
import './Search.scss'

function Search() {
  const [value, setValue] = useState('')

  return (
    <div className={classnames('search-container')}>
      <i className="fas fa-search fa-lg" />
      <ReactAutocomplete
        items={[
          { id: 'baz', label: 'Call to Order and Roll Call' },
          {
            id: 'foo',
            label:
              'Approval of Unemployment Insurance Appropriation Ordinance Adjustments to Increase Payment of Claims and Access Reserves',
          },
          {
            id: 'bar',
            label:
              'Retroactive Approval of City Hall Lightning Display Sponsored by Council District 1',
          },
        ]}
        shouldItemRender={(item, val) =>
          item.label.toLowerCase().indexOf(val.toLowerCase()) > -1
        }
        getItemValue={item => item.label}
        renderItem={(item, highlighted) => (
          <div
            key={item.id}
            style={{
              color: '#153948',
              padding: '10px 0 10px 10px',
              borderBlockEnd: 'solid #153948',
              borderWidth: '2px',
            }}
          >
            {item.label}
          </div>
        )}
        value={value}
        onChange={e => setValue(e.target.value)}
        onSelect={val => setValue(val)}
        wrapperStyle={{
          display: 'flex',
          borderRadius: '10px',
        }}
        inputProps={{
          placeholder: 'Search Agenda Items',
        }}
      />
    </div>
  )
}

export default Search
