import React, { useState, useEffect } from 'react';

import Modal from 'react-modal/lib/components/Modal';
import { RenderedAgendaItem } from '../MeetingView/AgendaView/AgendaItem';
import './ChangeMeetingStatus.scss';
/**
 * This is the component for subscribe confirmation modal window.
 *
 * props:
 *    numberOfSubscriptions
 *      A number of successful subscriptions
 *    onClose
 *      A function/callback which is called when the window is being closed
 */

function buildItemStyle(itemRef) {
  const rect = itemRef.getBoundingClientRect();
  const xPos = rect.left;
  const yPos = rect.top;

  return {
    width: `${itemRef.clientWidth}px`,
    height: `${itemRef.clientHeight}px`,
    position: 'absolute',
    left: `${xPos}px`,
    top: `${yPos}px`,
  };
}

const ChangeMeetingStatus = ({
  args, itemRef, dropDownRef, setDisplaySetStatusModal,
}) => {
  Modal.setAppElement('#root');
  const [itemStyle, setItemStyle] = useState(buildItemStyle(itemRef.current));
  console.log(dropDownRef);
  useEffect(() => {
    const eventListenerFunction = () => {
      setItemStyle(buildItemStyle(itemRef.current));
    };

    window.addEventListener('scroll', eventListenerFunction);
    window.addEventListener('resize', eventListenerFunction);

    return () => {
      window.removeEventListener('scroll', eventListenerFunction);
      window.removeEventListener('resize', eventListenerFunction);
    };
  }, [itemRef]);

  return (

    <Modal className="ChangeMeetingStatus" isOpen>

      <div style={itemStyle}>
        <RenderedAgendaItem {...args} />

        <ul className="buttonStyles">
          <li><input className="upComing" type="button" value="Upcoming" /></li>
        </ul>

      </div>

    </Modal>

  );
};

export default ChangeMeetingStatus;

// const ChangeMeetingStatus = React.forwardRef((props, ref) => {
//   const { numberOfSubscriptions, onClose } = props;
//   const { t } = useTranslation();
//   Modal.setAppElement('#root');

//   return (
//     <Modal
//       isOpen
//       style={
//         {
//           overlay: {
//             zIndex: '3001',
//           },
//         }
//       }
//       className={classnames('subscribe-confirmation')}
//       ref={ref}
//     >
//       <div className="modal-header">
//         <ConfirmationIcon />
//       </div>
//       <div className="modal-body">
//         <h4>
//           {t(
//             'meeting.tabs.agenda.list.subscribe.confirmation.title',
//             { count: numberOfSubscriptions },
//           )}
//         </h4>
//         <p>
//           {t('meeting.tabs.agenda.list.subscribe.confirmation.description')}
//         </p>
//         <div className="row">
//           <button
//             type="button"
//             onClick={onClose}
//           >
//             {t('meeting.tabs.agenda.list.subscribe.confirmation.button')}
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// });

// export default SubscribeConfirmation;
