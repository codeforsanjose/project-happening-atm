import MeetingStates from '../constants/MeetingStates';
import MeetingItemStates from '../constants/MeetingItemStates';

export function buildDropdownMeetingStatuses() {
  return [
    {
      label: 'meeting.status.short.upcoming',
      value: MeetingStates.UPCOMING,
      class: 'upcoming',
    },
    {
      label: 'meeting.status.short.in-progress',
      value: MeetingStates.IN_PROGRESS,
      class: 'in-progress',
    },
    {
      label: 'meeting.status.short.in-recess',
      value: MeetingStates.IN_RECESS,
      class: 'in-recess',
    },
    {
      label: 'meeting.status.short.ended',
      value: MeetingStates.ENDED,
      class: 'ended',
    },
    {
      label: 'meeting.status.short.deferred',
      value: MeetingStates.DEFERRED,
      class: 'deferred',
    },
  ];
}

export function buildDropdownAgendaItemStatuses() {
  return [
    {
      label: 'meeting.tabs.agenda.status.options.upcoming',
      value: MeetingItemStates.UPCOMING,
      class: 'upcoming',
    },
    {
      label: 'meeting.tabs.agenda.status.options.in-progress',
      value: MeetingItemStates.IN_PROGRESS,
      class: 'in-progress',
    },
    {
      label: 'meeting.tabs.agenda.status.options.on-hold',
      value: MeetingItemStates.ON_HOLD,
      class: 'on-hold',
    },
    {
      label: 'meeting.tabs.agenda.status.options.completed',
      value: MeetingItemStates.COMPLETED,
      class: 'completed',
    },
    {
      label: 'meeting.tabs.agenda.status.options.deferred',
      value: MeetingItemStates.DEFERRED,
      class: 'deferred',
    },
  ];
}
