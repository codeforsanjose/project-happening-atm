import React, { useRef } from 'react';
import './AdminUploadView.scss';

import { ReactComponent as PublishIcon } from '../../../../assets/publish-24px.svg';
import DragAndDrop from './DragAndDrop';

function AdminUploadView() {
  const fileInputRef = useRef();

  function handleFileChange(e) {
    const fileRef = fileInputRef.current;
    console.log('file is:', fileRef.files);
  }

  return (
    <div className="admin-upload">
      <DragAndDrop>
        <div className="upload-area">
          <PublishIcon />
          <p>Drag and Drop CSV File</p>
          <label for="csv">
            Or Upload from your Computer
          </label>
          <input
            className="visually-hidden"
            type="file"
            name="csv"
            id="csv"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
      </DragAndDrop>
    </div>
  )
}

export default AdminUploadView;