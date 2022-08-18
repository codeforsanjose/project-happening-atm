import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './MeetingView.scss';
import { useParams } from 'react-router-dom';

import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_MEETING_WITH_ITEMS } from '../../graphql/query';

import NavBarHeader from '../NavBarHeader/NavBarHeader';
import Header from '../Header/Header';
// import ParticipateView from "./ParticipateView/ParticipateView";
import AgendaView from './AgendaView/AgendaView';
import Spinner from '../Spinner/Spinner';
import { JoinMeetingIcon } from '../../utils/_icons';
/**
 * Component that displays a list of a meeting's agenda items.
 * Utilizes react-accessible-accordion to display groups of items.
 *
 * state:
 *    meetingWithItems
 *      An object representing the current meeting with an array of its agenda items
 *    navToggled
 *      A boolean value indicating if the header nav component is open
 */
const createMeeting = (data, setMeetingWithItems) => {
  const meeting = { ...data.getMeetingWithItems.meeting };
  meeting.items = data.getMeetingWithItems.items;
  setMeetingWithItems(meeting);
};

function MeetingView() {
  const { t } = useTranslation();
  const { id } = useParams();

  // queries
  const {
    loading, error, data, refetch,
  } = useQuery(GET_MEETING_WITH_ITEMS, {
    variables: { id: parseInt(id, 10) },
    fetchPolicy: 'network-only',
  });

  // states
  const [meetingWithItems, setMeetingWithItems] = useState({});
  const [navToggled, setNavToggled] = useState(false);
  // flag to indicate meeting items need to be saved
  const [saveMeetingItems, setSaveMeetingItems] = useState(false);
  // flag to indicate meeting items were updated by mutators
  const [meetingItemsUpdated, setMeetingItemsUpdated] = useState(false);
  // const [disableParticipateViewButton, setDisableParticipateViewButton] =
  // useState(false);
  const [progressStatus, setProgressStatus] = useState(false);

  // lazy queries
  const [getMeetingWithItems] = useLazyQuery(GET_MEETING_WITH_ITEMS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (d) => {
      createMeeting(d, setMeetingWithItems);
    },
  });

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  // this handles the initial query only
  useEffect(() => {
    if (data) {
      createMeeting(data, setMeetingWithItems);
    }
  }, [data]);

  // // disabled participate view while mutators are being processed by backend
  // useEffect(() => {
  //   if (saveMeetingItems) {
  //     setDisableParticipateViewButton(true);
  //   }
  // }, [saveMeetingItems]);

  // once mutators finish fetch the new data
  useEffect(() => {
    if (meetingItemsUpdated) {
      getMeetingWithItems({
        variables: { id: parseInt(id, 10) },
      });
      setMeetingItemsUpdated(false);
      // setDisableParticipateViewButton(false);
    }
  }, [meetingItemsUpdated, id, getMeetingWithItems]);

  const agendaViewArgs = {
    meeting: meetingWithItems,
    saveMeetingItems,
    setSaveMeetingItems,
    setMeetingItemsUpdated,
    setProgressStatus,
    refetchAllMeetings: refetch,
  };

  return (
    <div className="meeting-view">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />
      <Header
        loading={loading}
        meeting={meetingWithItems}
        setSaveMeetingItems={setSaveMeetingItems}
        progressStatus={progressStatus}
      />
      {loading && <Spinner />}
      {!(loading || error) && data && 'items' in meetingWithItems && (
        <a
          meeting={meetingWithItems}
          href={meetingWithItems.virtual_meeting_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button type="button" className="join-meeting">
            <JoinMeetingIcon />
            <p>
              {t(
                'meeting.tabs.participate.section.join.description.number-2.button',
              )}
            </p>
          </button>
        </a>
      )}
      {!(loading || error) && data && 'items' in meetingWithItems && (
        <AgendaView
          args={agendaViewArgs}
        />
      )}
      {error && <p className="error">{error.message}</p>}
    </div>
  );
}

export default MeetingView;
