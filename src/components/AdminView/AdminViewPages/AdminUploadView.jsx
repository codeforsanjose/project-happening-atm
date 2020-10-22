import React from 'react';
import './AdminUploadView.scss';

import { ReactComponent as PublishIcon } from '../../../assets/publish-24px.svg';

function AdminUploadView() {
  return (
    <div className="admin-upload">
      <div id="upload-area">
        <PublishIcon />
        <p>Drag and Drop CSV File</p>
        <p>Or Upload from your Computer</p>
      </div>
    </div>
  )
}

export default AdminUploadView;