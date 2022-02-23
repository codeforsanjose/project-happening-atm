import i18next from 'i18next';
import MeetingItemStates from '../constants/MeetingItemStates';

function buildButtonClasses() {
  return [
    {
      status: MeetingItemStates.PENDING,
      class: 'upComing',
      value: i18next.t('meeting.tabs.agenda.status.options.upcoming'),
    },
    {
      status: MeetingItemStates.IN_PROGRESS,
      class: 'inProgress',
      value: i18next.t('meeting.tabs.agenda.status.options.in-progress'),
    },
    {
      status: MeetingItemStates.COMPLETED,
      class: 'completed',
      value: i18next.t('meeting.tabs.agenda.status.options.completed'),
    },
    {
      status: MeetingItemStates.ON_HOLD,
      class: 'onHold',
      value: i18next.t('meeting.tabs.agenda.status.options.on-hold'),
    },
    {
      status: MeetingItemStates.DEFERRED,
      class: 'deffered',
      value: i18next.t('meeting.tabs.agenda.status.options.deferred'),
    },
  ];
}

export default buildButtonClasses;
