import React from 'react';
import './AdminUploadView.scss';

import { ReactComponent as PublishIcon } from '../../../../assets/publish-24px.svg';
import DragAndDrop from './DragAndDrop';

function AdminUploadView() {
  return (
    <div className="admin-upload">
      <DragAndDrop>
        <div id="upload-area">
          <PublishIcon />
          <p>Drag and Drop CSV File</p>
          <p>Or Upload from your Computer</p>
        </div>
      </DragAndDrop>
    </div>
  )
}

export default AdminUploadView;