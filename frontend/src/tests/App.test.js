import React from 'react';
// npm install react-test-renderer version 17.2.0 for compatibility: https://stackoverflow.com/questions/72088446/uncaught-typeerror-cannot-read-properties-of-undefined-reading-isbatchinglega
import renderer from 'react-test-renderer';
import { AdminMeetingItemLinks } from '../components/MeetingListView/MeetingListItemLinks';
import { MockedProvider } from '@apollo/client/testing'; // Enable mocking of client: https://github.com/apollographql/apollo-client/issues/2042

// Mock to allow react-i18next in AdminMeetingItemLinks: https://stackoverflow.com/questions/66973857/next-i18next-jest-testing-with-usetranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock to allow i18next in 'frontend/src/utils/timestampHelper.js': https://stackoverflow.com/questions/70850517/testing-i18next-complain-about-cannot-read-property-use-of-undefined
jest.mock('i18next', () => ({
  __esModule: true,
  use: () => {},
  init: () => {},
  default: {
    t: (key) => key,
  },
}));

// Mock to allow useHistory: https://stackoverflow.com/questions/58392815/how-to-mock-usehistory-hook-in-jest
// Mock of <Link> as used in AdminMeetingItemLinks: https://stackoverflow.com/questions/64213791/react-testing-library-and-link-element-type-is-invalid-expected-a-string-or-a
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue({
    location: { pathname: '/meeting/1' }, // pathname for view meeting #1 page
  }),
  Link: jest.fn().mockImplementation(({ children }) => {
    return children;
  }),
}));

// future effort: mock dayjs as used by timestampHelper.isFutureTimeStamp to capture proper classNames
it('renders admin mtg links on view mtg page that matches snapshot', () => {
  const tree = renderer
    .create(
      <MockedProvider>
        <AdminMeetingItemLinks meeting="__typename: 'meeting', id: 1, meeting_start_timestamp: '1703887201000', status: null" />
      </MockedProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

// Mock to allow useHistory: https://stackoverflow.com/questions/58392815/how-to-mock-usehistory-hook-in-jest
// Mock of <Link> as used in AdminMeetingItemLinks: https://stackoverflow.com/questions/64213791/react-testing-library-and-link-element-type-is-invalid-expected-a-string-or-a
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue({
    location: { pathname: '/' }, // pathname of main view meetings dashboard page
  }),
  Link: jest.fn().mockImplementation(({ children }) => {
    return children;
  }),
}));

// future effort: mock dayjs as used by timestampHelper.isFutureTimeStamp to capture proper classNames
it('renders admin mtg links on view mtgs dashboard page that matches snapshot', () => {
  const tree = renderer
    .create(
      <MockedProvider>
        <AdminMeetingItemLinks meeting="__typename: 'meeting', id: 1, meeting_start_timestamp: '1703887201000', status: null" />
      </MockedProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
