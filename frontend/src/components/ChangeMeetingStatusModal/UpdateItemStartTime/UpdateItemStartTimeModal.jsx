import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';

import Modal from 'react-modal/lib/components/Modal';
import { useTranslation } from 'react-i18next';
import { CloseIcon, ArrowUpwardIcon } from '../../../utils/_icons';
import { UPDATE_MEETING_ITEM } from '../../../graphql/graphql';

const UpdateItemStartTimeModal = () => {

  useEffect(() => {
    document.querySelector('body').style.overflow = 'hidden';

    return () => {
      document.querySelector('body').style.overflow = 'visible';
    };
  }, []);

  const modalOverlayStyle = {
    overlay: {
      backgroundColor: 'none',
    },
  };

  return (
    <Modal style={modalOverlayStyle} className="UpdateItemStartTimeModal" isOpen>

    </Modal>
  )
}

export default UpdateItemStartTimeModal