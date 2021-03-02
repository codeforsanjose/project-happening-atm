import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './MeetingView.scss';
import { useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { GET_MEETING_WITH_ITEMS } from '../../graphql/graphql';

import NavBarHeader from '../NavBarHeader/NavBarHeader';
import Header from '../Header/Header';
import ParticipateView from './ParticipateView/ParticipateView';
import AgendaView from './AgendaView/AgendaView';
import Spinner from '../Spinner/Spinner';

/**
 * Component that displays a list of a meeting's agenda items.
 * Utilizes react-accessible-accordion to display groups of items.
 *
 * state:
 *    meetingWithItems
 *      An object representing the current meeting with an array of its agenda items
 *    showAgendaView
 *      A boolean value indicating if the Agenda or Participate View is shown
 *    navToggled
 *      A boolean value indicating if the header nav component is open
 */

function MeetingView() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_MEETING_WITH_ITEMS, {
    variables: { id: parseInt(id, 10) },
  });

  const [meetingWithItems, setMeetingWithItems] = useState({});
  const [showAgendaView, setShowAgendaView] = useState(true);
  const [navToggled, setNavToggled] = useState(false);

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  useEffect(() => {
    if (data) {
      const meeting = { ...data.getMeetingWithItems.meeting };
      meeting.items = data.getMeetingWithItems.items;
      setMeetingWithItems(meeting);
    }
  }, [data]);

  return (
    <div className="meeting-view">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />
      <Header meeting={meetingWithItems} />

      <div className="view-toggle">
        <div className={showAgendaView ? 'view-active' : ''}>
          <button
            type="button"
            onClick={() => setShowAgendaView(true)}
          >
            {t('meeting.tabs.agenda.label')}
          </button>
        </div>
        <div className={showAgendaView ? '' : 'view-active'}>
          <button
            type="button"
            onClick={() => setShowAgendaView(false)}
          >
            {t('meeting.tabs.participate.label')}
          </button>
        </div>
      </div>
      {loading && <Spinner />}
      {!(loading || error) && data && 'items' in meetingWithItems
        && (
          showAgendaView
            ? <AgendaView meeting={meetingWithItems} />
            : <ParticipateView />
        )}
      {error && <p className="error">{ error.message }</p>}
    </div>
  );
}

export default MeetingView;
