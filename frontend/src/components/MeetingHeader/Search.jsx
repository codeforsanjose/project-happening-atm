import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import ReactAutocomplete from 'react-autocomplete';
import './Search.scss';

function Search() {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  return (
    <div className={classnames('search-container')}>
      <i className="fas fa-search" />
      <ReactAutocomplete
        items={[
          { id: 'baz', label: 'Call to Order and Roll Call' },
          { id: 'foo', label: 'Approval of Unemployment Insurance Appropriation Ordinance Adjustments to Increase Payment of Claims and Access Reserves' },
          { id: 'bar', label: 'Retroactive Approval of City Hall Lightning Display Sponsored by Council District 1' },
        ]}
        shouldItemRender={(item, val) => item.label.toLowerCase().indexOf(val.toLowerCase()) > -1}
        getItemValue={(item) => item.label}
        renderItem={(item, highlighted) => (
          <div
            key={item.id}
            className="menu-item"
          >
            {item.label}
          </div>
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSelect={(val) => setValue(val)}
        wrapperStyle={{
          display: 'flex',
          borderRadius: '10px',
        }}
        inputProps={{
          placeholder: t('meeting.tabs.agenda.list.search.placeholder'),
        }}
        menuStyle={{
          position: 'absolute',
          top: '45px',
          left: '0',
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          paddingTop: '2px',
          fontSize: '0.9em',
          overflow: 'auto',
          zIndex: 2,
        }}
      />
    </div>
  );
}

export default Search;
