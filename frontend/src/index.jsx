import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
} from '@apollo/client';

import './index.scss';

import classnames from 'classnames';
import MeetingList from './components/MeetingList/MeetingList';
import MeetingView from './components/MeetingView/MeetingView';
import Subscribe from './components/Subscribe/Subscribe';
import MeetingItem from './components/MeetingItem/MeetingItem';
import AdminView from './components/AdminView/AdminView';
import AdminUploadView from './components/AdminView/AdminUploadView/AdminUploadView';
import ParticipatePage from './components/MeetingView/ParticipateView/ParticipatePages/ParticipatePage';
import ParticipateJoin from './components/MeetingView/ParticipateView/ParticipatePages/ParticipateJoin';
import ParticipateWatch from './components/MeetingView/ParticipateView/ParticipatePages/ParticipateWatch';
import ParticipateComment from './components/MeetingView/ParticipateView/ParticipatePages/ParticipateComment';
import ParticipateRequest from './components/MeetingView/ParticipateView/ParticipatePages/ParticipateRequest';

import * as serviceWorker from './serviceWorker';

import { GET_ALL_MEETINGS_WITH_ITEMS, CREATE_SUBSCRIPTION } from './graphql/graphql';
import AdminPaths from './constants/AdminPaths';

import './i18n';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

function SampleQuery() {
  const { loading, error, data } = useQuery(GET_ALL_MEETINGS_WITH_ITEMS);

  // eslint-disable-next-line no-console
  if (loading) console.log('THE Loading: ', loading);
  // eslint-disable-next-line no-console
  if (error) console.log('THE Error: ', error);

  // eslint-disable-next-line no-console
  console.log(data);

  return null;
}

function SubscriptionPage() {
  const [createSubscription, { loading, error, data }] = useMutation(CREATE_SUBSCRIPTION);

  return (
    <Subscribe
      createSubscription={createSubscription}
      isLoading={loading}
      error={error}
      subscription={data && data.createSubscription}
    />
  );
}

function App() {
  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <Suspense fallback={<div>Loading translation files...</div>}>
          <div className={classnames('app-root')}>
            <Router>
              <Switch>
                <Route exact path="/">
                  <MeetingList />
                </Route>
                <Route path="/subscribe/:meetingId/:itemId">
                  <SubscriptionPage />
                </Route>
                <Route path="/meeting/:id">
                  <MeetingView />
                </Route>
                <Route path="/meeting-item/:id">
                  <MeetingItem />
                </Route>

                <Route exact path="/participate/join">
                  <ParticipatePage Component={ParticipateJoin} />
                </Route>
                <Route exact path="/participate/watch">
                  <ParticipatePage Component={ParticipateWatch} />
                </Route>
                <Route exact path="/participate/comment">
                  <ParticipatePage Component={ParticipateComment} />
                </Route>
                <Route exact path="/participate/request">
                  <ParticipatePage Component={ParticipateRequest} />
                </Route>

                <Route path={`${AdminPaths.EDIT_MEETING}/:id`}>
                  <AdminView
                    headerText="Edit Meeting Details"
                    component={() => <div>Placeholder for Edit Meeting</div>}
                  />
                </Route>

                <Route path={`${AdminPaths.EDIT_AGENDA}/:id`}>
                  <AdminView
                    headerText="Edit Agenda Items"
                    component={() => <div>Placeholder for Edit Agenda</div>}
                  />
                </Route>

                <Route path={`${AdminPaths.UPLOAD_CSV}/:id`}>
                  <AdminView
                    headerText="Upload New Agenda"
                    component={AdminUploadView}
                  />
                </Route>
              </Switch>
            </Router>
            <SampleQuery />
          </div>
        </Suspense>
      </ApolloProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
